import { Input } from "./input";
import React from "react";
import { CustomInputProps } from "../@types/input";

export const TimeInput = (props: CustomInputProps) => <Input {...props} mask="time" />;
export const CpfInput = (props: CustomInputProps) => <Input {...props} mask="cpf" />;
export const CnpjInput = (props: CustomInputProps) => <Input {...props} mask="cnpj" />;
export const CellphoneTelephoneInput = (props: CustomInputProps) => <Input {...props} mask="cellTelephone" />;
export const CellphoneInput = (props: CustomInputProps) => <Input {...props} mask="cellphone" />;
export const TelephoneInput = (props: CustomInputProps) => <Input {...props} mask="telephone" />;
export const CepInput = (props: CustomInputProps) => <Input {...props} mask="cep" />;
export const ColorInput = (props: CustomInputProps) => <Input {...props} mask="color" />;
export const CpfCnpjInput = (props: CustomInputProps) => <Input {...props} mask="cpfCnpj" />;
export const CreditCardInput = (props: CustomInputProps) => <Input {...props} mask="creditCard" />;
export const DateInput = (props: CustomInputProps) => <Input {...props} mask="date" />;
export const IntegerInput = (props: CustomInputProps) => <Input {...props} mask="int" />;
export const IsoDateInput = (props: CustomInputProps) => <Input {...props} mask="isoDate" />;
export const UuidInput = (props: CustomInputProps) => <Input {...props} mask="uuid" />;
