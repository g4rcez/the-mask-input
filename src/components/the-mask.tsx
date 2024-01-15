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
		const internalRef = useRef<HTMLInputElement>(null);
		useImperativeHandle(ref, () => internalRef.current!);
		const onChangeRef = useStableRef(onChange);
		const onChangeTextRef = useStableRef(onChangeText);
		const maskRef = useStableRef(mask);
		const wasMatch = useRef(valueWasMatch(mask, strict, (props.value || props.defaultValue) as string));
		const Component = as ?? "input";

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
		const formattedDefaultValue = formatMaskedValue(props.defaultValue as string, props.defaultValue as string);

		const patternMemo = useMemo(() => {
			if (pattern || mask === undefined) return pattern;
			if (typeof mask === "function") {
				const resultMask = mask(stateValue);
				return Array.isArray(resultMask) ? createPatternRegexMask(resultMask, strict) : createPattern(mask, stateValue, strict);
			}
			return typeof mask === "string" ? createPattern(mask, stateValue, strict) : createPatternRegexMask(mask, strict);
		}, [pattern, stateValue, strict, mask]);

		useEffect(() => {
			if (props.value === undefined) return;
			const newValue = formatMaskedValue(props.value as string, props.defaultValue as string);
			setStateValue(newValue);
			if (internalRef.current !== null) internalRef.current.value = newValue as string;
		}, [props.value, mask, transform, props.defaultValue]);

		useEffect(() => {
			if (internalRef.current === null) return;
			const inputHtml = internalRef.current;
			if (maskRef.current) {
				const target = internalRef.current;
				let previous = target.value || "";
				const changeMask = (event: any) => {
					const value = event.target.value;
					if (maskRef.current === undefined) {
						setStateValue(value);
						onChangeTextRef.current?.(value);
						onChangeRef.current?.(event);
						return onChangeText?.(value);
					}
					const regex = new RegExp(createPattern(maskRef.current, value, strict));
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
					let erasing = false;
					if (value.length < previous.length) {
						wasMatch.current = false;
						erasing = true;
					}
					if (regex.test(value)) wasMatch.current = true;
					let movement = cursor;
					const digit = value[movement - 1];
					const masked = formatRegexMask(
						value,
						typeof maskRef.current === "function" ? maskRef.current(value) : maskRef.current,
						transform ?? noop,
						tokens ?? originalTokens
					);
					target.value = masked;
					setStateValue(masked);
					while (movement < masked.length && masked.charAt(movement - 1) !== digit) movement += 1;
					if (erasing) moveCursor(target, cursor, cursor);
					else moveCursor(target, movement, movement);
					event.target.value = masked;
					previous = masked;
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
				onChange={props.value === undefined ? undefined : noop}
				defaultValue={assertString(props.defaultValue) ? formattedDefaultValue : undefined}
				value={assertString(props.value) ? formatMaskedValue(props.value as string, props.value as string) : props.value}
			/>
		);
	}
);

const assertString = (a: any): a is string => typeof a === "string";
