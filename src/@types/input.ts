import { CurrencyCode } from "./currency-code";
import { Locales } from "./locales";

export type CurrencyInputProps = Omit<InputProps, "value"> & {
	name?: string;
	locale?: Locales;
	currency?: CurrencyCode;
	ref?: React.RefObject<HTMLInputElement>;
	value?: string | number;
};

export type InputTypes =
	| "button"
	| "checkbox"
	| "color"
	| "date"
	| "datetime-local"
	| "email"
	| "file"
	| "hidden"
	| "image"
	| "month"
	| "number"
	| "password"
	| "radio"
	| "range"
	| "reset"
	| "search"
	| "submit"
	| "tel"
	| "text"
	| "time"
	| "url"
	| "week";

export type InputMode = "decimal" | "none" | "text" | "numeric" | "tel" | "search" | "email" | "url";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "autoCapitalize"> & {
	type?: InputTypes;
	inputMode?: InputMode;
	autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
};

export type MasksTypes =
	| "cellphone"
	| "cellTelephone"
	| "cep"
	| "cnpj"
	| "color"
	| "cpf"
	| "cpfCnpj"
	| "creditCard"
	| "currency"
	| "date"
	| "isoDate"
	| "int"
	| "telephone";

export type FixedMasks = Exclude<MasksTypes, "currency">;

export type MasksConfig = { [k in FixedMasks]: MaskConfig };

export type MaskConfig = {
	mask: Array<string | RegExp> | ((mask?: string) => Array<string | RegExp>);
	pattern: string;
	title: string;
	inputMode: InputMode;
	convert(str?: string): string;
};

export type MaskChar = string | RegExp | MasksTypes;

export type MaskType = MaskChar[] | ((value: string) => MaskChar[]);

export type Masks = MasksTypes | Array<string | RegExp> | Function;

export type KeyboardProp = {
	pattern: string;
	title: string;
	inputMode: InputMode;
};
export type DecimalKeyboardProps = { [key in FixedMasks]: KeyboardProp };

export type MaskInputProps = {
	autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
	type?: InputTypes;
	mask?: Masks;
	value?: string;
};

export type CustomInputProps = Omit<CurrencyInputProps, "value"> & InputProps & MaskInputProps;
