import React, { useMemo } from "react";
import type { CurrencyInputProps, CurrencyMaskTypes } from "./components/currency-input";
import type { PercentInputMask, PercentInputProps } from "./components/percent-input";
import { TheMaskInput, type TheMaskPropsMerge } from "./input";
import { has } from "./libs";
import { inputMaskedProps, type MaskConfig, type Masks } from "./masks";
import type { HtmlInputProps, MaskInputProps } from "./types";

export type { CurrencyInputProps, CurrencyMaskTypes } from "./components/currency-input";
export type { PercentInputProps, PercentInputMask } from "./components/percent-input";
export type { TheMaskPropsMerge as TheMaskProps } from "./input";
export type { TheMask, TheMask as MaskInput } from "./components/the-mask";
export type { HtmlInputProps, Locales, CurrencyCode, CurrencyDisplay, AutoCapitalize, InputMode, InputTypes } from "./types";
export { CurrencyInput, CurrencyInput as MoneyInput } from "./components/currency-input";
export { PercentageInput } from "./components/percent-input";
export { masks, inputMaskedProps } from "./masks";

const Component = (mask: MaskConfig) => (props: TheMaskPropsMerge) => <TheMaskInput {...mask} {...(props as any)} />;

type LooseString<T extends string> = T | Omit<string, T>;

export type AllMasks = LooseString<Masks>;

type ArrayMask = Array<string | RegExp> | ((p: string) => Array<string | RegExp> | AllMasks);

export const CellTelephone = Component(inputMaskedProps.cellTelephone);
export const Cellphone = Component(inputMaskedProps.cellphone);
export const Cep = Component(inputMaskedProps.cep);
export const Cnpj = Component(inputMaskedProps.cnpj);
export const Color = Component(inputMaskedProps.color);
export const Cpf = Component(inputMaskedProps.cpf);
export const CpfCnpj = Component(inputMaskedProps.cpfCnpj);
export const CreditCard = Component(inputMaskedProps.creditCard);
export const Date = Component(inputMaskedProps.date);
export const Int = Component(inputMaskedProps.int);
export const IsoDate = Component(inputMaskedProps.isoDate);
export const Telephone = Component(inputMaskedProps.telephone);
export const Time = Component(inputMaskedProps.time);
export const Uuid = Component(inputMaskedProps.uuid);

export type TheMaskInputProps = HtmlInputProps &
	(
		| ({ mask: PercentInputMask } & PercentInputProps)
		| ({ mask: CurrencyMaskTypes } & CurrencyInputProps)
		| ({ mask: AllMasks } & Omit<MaskInputProps, "mask">)
		| ({ mask: ArrayMask } & Omit<MaskInputProps, "mask">)
		| ({ mask?: AllMasks } & Omit<MaskInputProps, "mask">)
	);

export const Input: (props: TheMaskInputProps) => React.ReactElement = React.forwardRef<HTMLInputElement, TheMaskInputProps>(
	function InternalMaskInput(props, externalRef) {
		const maskConfig = useMemo(() => {
			if (!props.mask) return undefined;
			if (typeof props.mask === "string" && has(inputMaskedProps, props.mask)) {
				return inputMaskedProps[props.mask];
			}
			return { mask: props.mask };
		}, [props.mask]);
		const allProps = { ...props, ...maskConfig };
		return <TheMaskInput {...(allProps as MaskInputProps)} ref={externalRef} />;
	}
) as never;

export default Input;
