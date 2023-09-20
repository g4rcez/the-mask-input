import React, { ChangeEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { CurrencyInput, CurrencyInputProps, isCurrencyInput } from "./currency-input";
import { createPattern, createPatternRegexMask, originalTokens } from "./masks";
import { isPercentageInput, PercentageInput, PercentInputProps } from "./percent-input";
import { Mask, MaskInputProps, Token, Tokens } from "./types";

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
		if (token.regex.test(char)) {
			output += token.parse?.(char) ?? char;
		}
		countMask += 1;
		i += 1;
	}
	return output;
}

const noop = (s: string) => s;

export const MaskInput = forwardRef<HTMLInputElement, MaskInputProps>(
	({ onChange, strict = true, transform, pattern, tokens, mask, onChangeText, as, ...props }, ref) => {
		const Component = as ?? "input";
		const internalRef = useRef<HTMLInputElement>(null);
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
		const formattedDefaultValue = formatMaskedValue(undefined, props.defaultValue as string);

		useEffect(() => {
			if (props.value === undefined) return;
			const newValue = formatMaskedValue(props.value as string, props.defaultValue as string);
			setStateValue(newValue);
			if (internalRef.current !== null) internalRef.current.value = newValue as string;
		}, [props.value, mask, transform, props.defaultValue]);

		const patternMemo = useMemo(() => {
			if (pattern || mask === undefined) return pattern;
			if (typeof stateValue === "string") return createPattern(mask, stateValue, strict);
			if (typeof mask === "function") {
				const resultMask = mask(stateValue as unknown as string);
				return Array.isArray(resultMask) ? createPatternRegexMask(resultMask, strict) : createPattern(mask, resultMask, strict);
			}
			return Array.isArray(mask) ? createPatternRegexMask(mask, strict) : undefined;
		}, [pattern, stateValue, strict, mask]);

		const changeMask = (event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;
			if (mask === undefined) {
				setStateValue(value);
				onChangeText?.(value);
				return onChange?.(event);
			}
			const refInput = event.target;
			let caret = refInput.selectionEnd ?? 0;
			const digit = value[caret - 1];
			const masked = formatRegexMask(value, typeof mask === "function" ? mask(value) : mask, transform ?? noop, tokens ?? originalTokens);
			refInput.value = masked;
			if (masked === stateValue) return;
			setStateValue(masked);
			onChangeText?.(masked);
			while (caret < masked.length && masked.charAt(caret - 1) !== digit) {
				caret += 1;
			}
			if (refInput !== document.activeElement) {
				refInput.setSelectionRange(caret, caret);
			}
			event.target.value = masked;
			onChange?.(event);
		};

		return (
			<Component
				{...props}
				defaultValue={formattedDefaultValue}
				pattern={patternMemo}
				onChange={changeMask}
				ref={internalRef}
			/>
		);
	}
);

export type TheMaskPropsMerge = MaskInputProps | CurrencyInputProps | PercentInputProps;

export const TheMaskInput = forwardRef<HTMLInputElement, TheMaskPropsMerge>((props, externalRef) => {
	if (isCurrencyInput(props.mask)) {
		return <CurrencyInput {...(props as any)} mask={undefined} ref={externalRef} />;
	}
	if (isPercentageInput(props.mask)) {
		return <PercentageInput {...(props as any)} mask={undefined} ref={externalRef} />;
	}
	return <MaskInput {...props} ref={externalRef} />;
});
