import { TheMaskInput, TheMaskPropsMerge } from "./input";
import { inputMaskedProps, MaskConfig } from "./masks";
import React from "react";

export { TheMaskInput, TheMaskInput as Input } from "./input";
export { CurrencyInput, CurrencyInput as MoneyInput } from "./currency-input";
export { createPattern, masks, inputMaskedProps } from "./masks";

export const Component = (mask: (v: string) => MaskConfig) => (props: TheMaskPropsMerge) =>
	<TheMaskInput {...mask(props.value ?? "")} {...(props as any)} />;

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
