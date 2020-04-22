import React, { useImperativeHandle, useRef } from "react";
import MaskedInput from "react-text-mask";
import { DecimalKeyboard, InputProps, InputTypes, KeyboardProp, MasksTypes } from "./@types/input";
import { CurrencyInput, CurrencyInputProps } from "./currency-input";
import { convertMaskToString, decimalKeyboard, maskConverter, masks } from "./helpers/masks";

export type MaskInputProps = {
	autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
	type?: InputTypes;
	mask?: MasksTypes | Array<string | RegExp> | Function;
	value?: string;
	ref?: any;
};

type CustomInputProps = Omit<CurrencyInputProps, "value"> & InputProps & MaskInputProps;

type ValueType = string | number | string[] | undefined;

type MaskChar = string | RegExp | MasksTypes;
type MaskType = MaskChar[] | ((value: string) => MaskChar[]);

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

		const options = { mask, name, value, type };

		if (mask === undefined) {
			return <input {...html} {...options} ref={internalRef} />;
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
					{...options}
					guide
					mask={maskRegex}
					value={maskedValue}
					placeholder={placeholder}
					ref={internalRef as any}
				/>
			);
		}
		return <MaskedInput guide {...html} {...options} mask={mask as MaskType} />;
	}
);
