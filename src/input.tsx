import React, { ChangeEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Mask, MaskInputProps, TheMasks, Token, Tokens } from "./types";
import { originalTokens } from "./masks";
import { CurrencyInput, CurrencyInputProps, isCurrencyInput } from "./currency-input";
import { isPercentageInput, PercentageInput, PercentInputProps } from "./percent-input";

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

const stringPattern = (result: string) => {
	const len = result.length;
	const m = [];
	for (let i = 0; i < len; i++) {
		const char = result[i];
		const token = originalTokens[char];
		token === undefined ? m.push(char.replace(/\./g, "\\.").replace(/\(/g, "\\(").replace(/\)/g, "\\)")) : m.push(token.regex?.source);
	}
	return m.join("").replace(/\\\\/g, "\\");
};

export const createPattern = (mask: TheMasks, value: string) => {
	const maskIsFunction = typeof mask === "function";
	let result: string | Mask[] = maskIsFunction ? "" : mask;
	if (maskIsFunction) {
		result = mask(value);
	}
	return typeof result !== "string" ? "" : stringPattern(result);
};

const noop = (s: string) => s;

const MaskInput = forwardRef<HTMLInputElement, MaskInputProps>(({ onChange, transform, pattern, tokens, mask, onChangeText, as, ...props }, ref) => {
	const Component = as ?? "input";
	const internalRef = useRef<HTMLInputElement>(null);
	useImperativeHandle(ref, () => internalRef.current!);

	const formatMaskedValue = useCallback(() => {
		const v = props.value ?? props.defaultValue ?? "";
		if (mask === undefined) return v;
		const value = v?.toString() ?? "";
		return formatRegexMask(value, typeof mask === "function" ? mask(value) : mask, transform ?? noop, tokens ?? originalTokens);
	}, [props.value, props.defaultValue, transform, mask, tokens]);

	const [stateValue, setStateValue] = useState(formatMaskedValue);

	useEffect(() => {
		if (props.value === undefined) return;
		setStateValue(formatMaskedValue);
	}, [props.value, mask, transform, props.defaultValue]);

	const patternMemo = useMemo(() => {
		if (pattern) return pattern;
		if (mask === undefined) return undefined;
		if (typeof stateValue === "string") return createPattern(mask, stateValue);
		return undefined;
	}, [pattern, stateValue]);

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
	return <Component {...props} pattern={patternMemo} defaultValue={undefined} onChange={changeMask} value={stateValue} ref={internalRef} />;
});

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
