import React, { forwardRef } from "react";
import { CurrencyInput, CurrencyInputProps, isCurrencyInput } from "./components/currency-input";
import { isPercentageInput, PercentageInput, PercentInputProps } from "./components/percent-input";
import { TheMask } from "./components/the-mask";
import { MaskInputProps } from "./types";

export type TheMaskPropsMerge = MaskInputProps | CurrencyInputProps | PercentInputProps;

export const TheMaskInput = forwardRef<HTMLInputElement, TheMaskPropsMerge>((props, externalRef) => {
	if (isCurrencyInput(props.mask)) {
		return <CurrencyInput {...(props as CurrencyInputProps)} mask={undefined} ref={externalRef} />;
	}
	if (isPercentageInput(props.mask)) {
		return <PercentageInput {...(props as PercentInputProps)} mask={undefined} ref={externalRef} />;
	}
	return <TheMask {...props} ref={externalRef} />;
});
