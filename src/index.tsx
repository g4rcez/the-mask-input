import { TheMaskInput, TheMaskPropsMerge } from "./input";
import { inputMaskedProps, MaskConfig, Masks } from "./masks";
import React, { useMemo } from "react";
import { has } from "./libs";
import { CurrencyInputProps, CurrencyMaskTypes } from "./currency-input";
import { PercentInputMask, PercentInputProps } from "./percent-input";
import { MaskInputProps } from "./types";

export { CurrencyInput, CurrencyInput as MoneyInput } from "./currency-input";
export { masks, inputMaskedProps } from "./masks";
export { PercentageInput } from "./percent-input";
export type { TheMaskPropsMerge as TheMaskProps } from "./input";

const Component = (mask: MaskConfig) => (props: TheMaskPropsMerge) => <TheMaskInput {...mask} {...(props as any)} />;

type LooseString<T extends string> = T | Omit<string, T>;

type AllMasks = LooseString<Masks> | string | Array<string | RegExp>;

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
	);

export const Input = React.forwardRef<HTMLInputElement, TheMaskInputProps>(function InternalMaskInput(props, externalRef) {
	const maskConfig = useMemo(
		() => (typeof props.mask === "string" && has(inputMaskedProps, props.mask) ? inputMaskedProps[props.mask] : { mask: props.mask }),
		[props.mask]
	);
	return <TheMaskInput {...props} ref={externalRef} {...maskConfig} />;
});

export default Input;
