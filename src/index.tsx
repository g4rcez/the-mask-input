import { TheMaskInput } from "./input";
import { inputMaskedProps, MaskConfig } from "./masks";
import React, { useMemo } from "react";
import { PercentInputProps } from "./percent-input";
import { TheMaskInputProps } from "./types";

export { CurrencyInput, CurrencyInput as MoneyInput } from "./currency-input";
export { masks, inputMaskedProps } from "./masks";
export type { TheMaskPropsMerge as TheMaskProps } from "./input";
export type { CurrencyInputProps } from "./currency-input";
import type { CurrencyInputProps } from "./currency-input";

const Component = (mask: MaskConfig) => (props: TheMaskPropsMerge) => <TheMaskInput {...mask} {...(props as any)} />;

const has = <T extends {}>(obj: T, key: keyof T | string): key is keyof T => Object.prototype.hasOwnProperty.call(obj, key);

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

export type TheMaskPropsMerge =
	| TheMaskInputProps
	| (TheMaskInputProps & { mask?: TheMaskInputProps["mask"] })
	| (CurrencyInputProps & { mask?: "money" | "currency" })
	| (PercentInputProps & { mask?: "percent" });

export const Input = React.forwardRef<HTMLInputElement, TheMaskPropsMerge>(function InternalMaskInput(props, externalRef) {
	const maskConfig = useMemo(
		() => (typeof props.mask === "string" && has(inputMaskedProps, props.mask) ? inputMaskedProps[props.mask] : { mask: props.mask }),
		[props.mask]
	);
	return <TheMaskInput {...props} ref={externalRef} {...maskConfig} />;
});

export default Input;
