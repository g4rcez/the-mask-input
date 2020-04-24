import React, { useImperativeHandle, useRef } from "react";
import MaskedInput from "react-text-mask";
import { DecimalKeyboard, KeyboardProp } from "../@types/input";
import { CustomInputProps, ValueType, MaskType } from "../@types/masks";
import { convertMaskToString, decimalKeyboard, maskConverter, masks } from "../helpers/masks";
import { CurrencyInput } from "./currency-input";

const createPlaceholder = (maskRegex: string) => convertMaskToString(maskRegex);

const instanceMaskValues = (mask: DecimalKeyboard, html: any, value: ValueType, props: CustomInputProps) => {
	const maskRegex = (masks as any)[mask];
	const tmp = decimalKeyboard[mask];
	const extraProps: KeyboardProp = {
		inputMode: tmp.inputMode || props.inputMode,
		pattern: tmp.pattern || props.pattern || "",
		title: tmp.title || props.title || ""
	};
	return {
		...extraProps,
		maskRegex,
		placeholder: html.placeholder || createPlaceholder(maskRegex),
		maskedValue: maskConverter.hasOwnProperty(mask) ? (maskConverter as any)[mask](`${value}`) : value
	};
};

export const Input = React.forwardRef<HTMLInputElement | null, CustomInputProps>(
	({ type = "text", mask, value = "", name, ...html }, externalRef) => {
		const internalRef = useRef<HTMLInputElement | null>(null);
		useImperativeHandle(externalRef, () => internalRef.current!);

		if (mask === undefined) {
			return <input {...html} name={name} type={type} value={value} ref={internalRef} />;
		}

		if (mask === "currency") {
			return <CurrencyInput {...html} value={value} ref={internalRef} />;
		}

		if (mask && mask in masks) {
			const { maskRegex, maskedValue, placeholder, ...others } = instanceMaskValues(mask as any, html, value, html as any);
			return (
				<MaskedInput
					{...html}
					{...others}
					guide
					mask={maskRegex}
					name={name}
					placeholder={placeholder}
					ref={internalRef as any}
					type={type}
					value={maskedValue}
				/>
			);
		}
		return <MaskedInput guide {...html} name={name} type={type} value={value} mask={mask as MaskType} ref={internalRef as any} />;
	}
);
