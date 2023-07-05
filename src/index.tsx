import { MaskInput, TheMaskInput, TheMaskPropsMerge } from "./input";
import { inputMaskedProps, MaskConfig, Masks } from "./masks";
import React, { useMemo } from "react";
import { has } from "./libs";
import { CurrencyInput, CurrencyInputProps, CurrencyMaskTypes, isCurrencyInput } from "./currency-input";
import { isPercentageInput, PercentageInput, PercentInputMask, PercentInputProps } from "./percent-input";
import { MaskInputProps } from "./types";

export { CurrencyInput, CurrencyInput as MoneyInput } from "./currency-input";
export { masks, inputMaskedProps } from "./masks";
export { PercentageInput } from "./percent-input";
export type { TheMaskPropsMerge as TheMaskProps } from "./input";

const Component = (mask: MaskConfig) => (props: TheMaskPropsMerge) => <TheMaskInput {...mask} {...(props as any)} />;

type LooseString<T extends string> = T | Omit<string, T>;

type ArrayMask = Array<string | RegExp> | ((p: string) => Array<string | RegExp> | string);

type AllMasks = LooseString<Masks>;

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

export type TheMaskInputProps = React.ComponentPropsWithRef<"input"> &
	(
		| ({ mask: PercentInputMask } & PercentInputProps)
		| ({ mask: CurrencyMaskTypes } & CurrencyInputProps)
		| ({ mask: AllMasks } & MaskInputProps)
		| ({ mask?: AllMasks } & MaskInputProps)
		| ({ mask?: ArrayMask } & MaskInputProps)
	);

export const Input: (props: TheMaskInputProps) => JSX.Element = React.forwardRef<HTMLInputElement, TheMaskInputProps>(function InternalMaskInput(
	props,
	externalRef
) {
	const maskConfig = useMemo(() => {
		if (!props.mask) return undefined;
		if (typeof props.mask === "string" && has(inputMaskedProps, props.mask)) {
			return inputMaskedProps[props.mask];
		}
		return { mask: props.mask };
	}, [props.mask]);
	const allProps = { ...props, ...maskConfig };
	if (isCurrencyInput(props.mask)) {
		return <CurrencyInput {...(allProps as CurrencyInputProps)} mask="currency" ref={externalRef} />;
	}
	if (isPercentageInput(props.mask)) {
		return <PercentageInput {...(allProps as PercentInputProps)} mask="percentual" ref={externalRef} />;
	}
	return <MaskInput {...allProps} {...maskConfig} ref={externalRef} />;
}) as never;

export default Input;
