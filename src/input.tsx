import React, { ChangeEvent, forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Mask, TheMaskInputProps, TheMasks, Token, Tokens } from "./types";
import { originalTokens } from "./masks";
import { CurrencyInput, CurrencyInputProps } from "./currency-input";

function formatRegexMask(value: string, mask: string | Mask[], tokens: Tokens = originalTokens) {
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

const applyMask = (value: string, mask: TheMasks, tokens: Tokens) => formatRegexMask(value, typeof mask === "function" ? mask(value) : mask, tokens);

export const createPattern = (mask: TheMasks, value: string) => {
	const maskIsFunction = typeof mask === "function";
	let result: string | Mask[] = maskIsFunction ? "" : mask;
	if (maskIsFunction) {
		result = mask(value);
	}
	if (typeof result === "string") {
		const len = result.length;
		const m = [];
		for (let i = 0; i < len; i++) {
			const char = result[i];
			const token = originalTokens[char];
			token === undefined ? m.push(char.replace(/\./g, "\\.").replace(/\(/g, "\\(").replace(/\)/g, "\\)")) : m.push(token.regex?.source);
		}
		return m.join("").replace(/\\\\/g, "\\");
	}
	return "";
};

const MaskInput = forwardRef<HTMLInputElement, TheMaskInputProps>(({ onChange, pattern, tokens, mask, onChangeText, as, ...props }, ref) => {
	const Component = as ?? "input";
	const internalRef = useRef<HTMLInputElement>(null);
	useImperativeHandle(ref, () => internalRef.current!);
	const [stateValue, setStateValue] = useState(props.value ?? props.defaultValue ?? "");

	const patternMemo = useMemo(() => {
		if (pattern) return pattern;
		if (mask === undefined) return;
		return createPattern(mask, stateValue);
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
		const masked = applyMask(value, mask, tokens ?? originalTokens);
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
	return <Component {...props} pattern={patternMemo} onChange={changeMask} value={stateValue} ref={internalRef} />;
});

export type TheMaskPropsMerge = (TheMaskInputProps & { mask?: TheMaskInputProps["mask"] }) | (CurrencyInputProps & { mask?: "money" | "currency" });

export const TheMaskInput = forwardRef<HTMLInputElement, TheMaskPropsMerge>((props, externalRef) => {
	if (props.mask === "currency" || props.mask === "money") {
		return <CurrencyInput {...props} mask={undefined} ref={externalRef} />;
	}
	return <MaskInput {...props} ref={externalRef} />;
});
