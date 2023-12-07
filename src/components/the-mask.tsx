import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useStableRef } from "../libs";
import { createPattern, createPatternRegexMask, originalTokens } from "../masks";
import { Mask, MaskInputProps, TheMasks, Token, Tokens } from "../types";

function formatRegexMask(v: string, mask: string | Mask[], transform: (x: string) => string, tokens: Tokens = originalTokens) {
	const value = transform(v);
	let output = "";
	for (let countMask = 0, i = 0; countMask < mask.length && i < value.length; ) {
		const maskChar = mask[countMask];
		const masker = maskChar instanceof RegExp ? maskChar : tokens[maskChar];
		const char = value[i];
		if (masker === undefined) {
			output += maskChar;
			if (char === maskChar) i += 1;
			countMask += 1;
			continue;
		}
		const token: Token = masker instanceof RegExp ? { regex: masker } : masker;
		if (token.regex.test(char)) output += token.parse?.(char) ?? char;
		i += 1;
		countMask += 1;
	}
	return output;
}

const noop = <T,>(s: T): T => s;

const valueWasMatch = (mask: TheMasks | undefined, strict: boolean, value: string | undefined) => {
	if (!mask || !value) return false;
	const regex = new RegExp(createPattern(mask, value, strict));
	return regex.test(value);
};

export const TheMask = forwardRef<HTMLInputElement, MaskInputProps>(
	({ infinity = false, strict = true, transform, onChange, pattern, tokens, mask, onChangeText, as, ...props }, ref) => {
		const onChangeRef = useStableRef(onChange);
		const onChangeTextRef = useStableRef(onChangeText);
		const maskRef = useStableRef(mask);
		const internalRef = useRef<HTMLInputElement>(null);
		const wasMatch = useRef(valueWasMatch(mask, strict, (props.value || props.defaultValue) as string));
		const Component = as ?? "input";
		useImperativeHandle(ref, () => internalRef.current!);

		const formatMaskedValue = useCallback(
			(value?: string, defaultValue?: string) => {
				const v = value ?? defaultValue ?? "";
				if (mask === undefined) return v;
				const finalValue = v?.toString() ?? "";
				return formatRegexMask(finalValue, typeof mask === "function" ? mask(finalValue) : mask, transform ?? noop, tokens ?? originalTokens);
			},
			[transform, mask, tokens]
		);

		const [stateValue, setStateValue] = useState(() => formatMaskedValue(props.value as string, props.defaultValue as string));
		const formattedDefaultValue = useMemo(
			() => formatMaskedValue(props.defaultValue as string, props.defaultValue as string),
			[props.defaultValue]
		);

		useEffect(() => {
			if (props.value === undefined) return;
			const newValue = formatMaskedValue(props.value as string, props.defaultValue as string);
			setStateValue(newValue);
			if (internalRef.current !== null) internalRef.current.value = newValue as string;
		}, [props.value, mask, transform, props.defaultValue]);

		const patternMemo = useMemo(() => {
			if (pattern || mask === undefined) return pattern;
			if (typeof mask === "function") {
				const resultMask = mask(stateValue);
				return Array.isArray(resultMask) ? createPatternRegexMask(resultMask, strict) : createPattern(mask, stateValue, strict);
			}
			return typeof mask === "string" ? createPattern(mask, stateValue, strict) : createPatternRegexMask(mask, strict);
		}, [pattern, stateValue, strict, mask]);

		useEffect(() => {
			if (internalRef.current === null) return;
			const inputHtml = internalRef.current;
			if (maskRef.current) {
				const target = internalRef.current;
				const changeMask = (event: any) => {
					const value = event.target.value;
					if (mask === undefined) {
						setStateValue(value);
						onChangeTextRef.current?.(value);
						onChangeRef.current?.(event);
						return onChangeText?.(value);
					}
					const regex = new RegExp(createPattern(mask, value, strict));
					const cursor = target.selectionEnd ?? 0;
					const moveCursor = (input: HTMLInputElement, from: number, to: number) => {
						if (input.type === "number") return;
						return input.setSelectionRange(from, to);
					};
					if (infinity) {
						if (wasMatch.current && value.length >= stateValue.length) {
							target.value = stateValue;
							return moveCursor(target, cursor - 1, cursor - 1);
						}
					}
					if (regex.test(value)) wasMatch.current = true;
					let movement = cursor;
					const digit = value[movement - 1];
					const masked = formatRegexMask(
						value,
						typeof mask === "function" ? mask(value) : mask,
						transform ?? noop,
						tokens ?? originalTokens
					);
					target.value = masked;
					setStateValue(masked);
					while (movement < masked.length && masked.charAt(movement - 1) !== digit) movement += 1;
					const move = masked.length + 1;
					moveCursor(target, move, move);
					target.value = masked;
					onChangeTextRef.current?.(masked);
					onChangeRef.current?.(event);
				};
				inputHtml.addEventListener("input", changeMask);
				return () => inputHtml.removeEventListener("input", changeMask);
			}
			return undefined;
		}, []);

		return (
			<Component
				{...props}
				ref={internalRef}
				pattern={patternMemo}
				onChange={onChange || onChangeText ? noop : undefined}
				defaultValue={props.value || props.value === "" ? undefined : formattedDefaultValue}
				value={typeof props.value === "string" ? formatMaskedValue(props.value as string, props.value as string) : props.value}
			/>
		);
	}
);
