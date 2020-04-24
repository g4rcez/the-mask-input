import { MasksTypes, InputTypes, InputProps } from "./input";
import { CurrencyInputProps } from "../components/currency-input";

export type Masks = MasksTypes | Array<string | RegExp> | Function;

export type MaskInputProps = {
	autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
	type?: InputTypes;
	mask?: Masks;
	value?: string;
};

export type CustomInputProps = Omit<CurrencyInputProps, "value"> & InputProps & MaskInputProps;

export type ValueType = string | number | string[] | undefined;
export type MaskChar = string | RegExp | MasksTypes;
export type MaskType = MaskChar[] | ((value: string) => MaskChar[]);
