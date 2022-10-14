import React, { ChangeEvent, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Mask, TheMaskInputProps, TheMasks, Tokens } from "./types";
import { originalTokens } from "./masks";
import { CurrencyInput, CurrencyInputProps } from "./currency-input";

function forRegexMask(value: string = "", mask: string | Mask[], tokens: Tokens = originalTokens) {
	let output = "";
	const len = mask.length;
	const valueLen = value.length;
	if (valueLen > mask.length) return value.substring(0, len);
	for (let i = 0; i < valueLen; i++) {
		const char = value.charAt(i);
		const matcher = mask[i];
		if (matcher instanceof RegExp) {
			if (matcher.test(char)) {
				output += char;
			}
		} else {
			const token = tokens[matcher];
			if (token && token.escape) {
				continue;
			}
			if (token && token.regex) {
				if (token.regex.test(char)) {
					output += char;
				}
			} else {
				output += matcher;
			}
		}
	}
	return output;
}

const masker = (value: string, mask: TheMasks, tokens: Tokens) => {
	if (typeof mask === "function") {
		const realMask = mask(value);
		return forRegexMask(value, realMask, tokens);
	}
	return forRegexMask(value, mask, tokens);
};

const emitChange = (input: HTMLInputElement, value: string) => {
	const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
	nativeInputValueSetter?.call(input, value);
	input.dispatchEvent(new Event("input", { bubbles: true }));
};

const MaskInput = forwardRef(({ onChange, tokens, mask, as, ...props }: TheMaskInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
	const Component = as ?? "input";
	const internalRef = useRef<HTMLInputElement>(null);
	useImperativeHandle(ref, () => internalRef.current!);
	const [stateValue, setStateValue] = useState(props.value ?? props.defaultValue ?? "");

	const changeMask = (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.isTrusted || internalRef.current === null) return;
		if (mask === undefined) {
			setStateValue(event.target.value);
			return onChange?.(event);
		}
		const refInput = internalRef.current;
		const currentInput = event.currentTarget;
		let caret = refInput.selectionEnd ?? 0;
		const digit = refInput.value[caret - 1];
		refInput.value = masker(currentInput.value, mask, tokens ?? originalTokens);
		const value = refInput.value;
		if (value === stateValue) return;
		setStateValue(value);
		while (caret < value.length && value.charAt(caret - 1) !== digit) {
			caret += 1;
		}
		if (refInput !== document.activeElement) {
			refInput.setSelectionRange(caret, caret);
			setTimeout(() => refInput.setSelectionRange(caret, caret), 0);
		}
		emitChange(refInput, value);
		onChange?.(event);
	};

	return <Component {...props} onChange={changeMask} ref={internalRef} value={stateValue} />;
});

export type TheMaskPropsMerge = (TheMaskInputProps & { mask?: TheMaskInputProps["mask"] }) | (CurrencyInputProps & { mask?: "money" | "currency" });

export const TheMaskInput = forwardRef<HTMLInputElement, TheMaskPropsMerge>((props, externalRef) => {
	if (props.mask === "currency" || props.mask === "money") {
		return <CurrencyInput {...props} mask={undefined} ref={externalRef} />;
	}
	return <MaskInput {...props} ref={externalRef} />;
});
