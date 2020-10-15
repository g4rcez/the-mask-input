import { CurrencyCode } from "./currency-code";
import { Locales } from "./locales";

export type CurrencyInputProps = Omit<InputProps, "value"> & {
	name?: string;
	adjustCaret?: boolean;
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
	| "email"
	| "telephone";

export type FixedMasks = Exclude<MasksTypes, "currency">;

export type MasksConfig = Record<FixedMasks, MaskConfig>;

export type ArrayMask = Array<string | RegExp>;

export type MaskConfig = {
	mask: ArrayMask | ((mask?: string) => ArrayMask);
	revert: (masked: string) => string;
	pattern: string;
	title: string;
	inputMode: InputMode;
};

type Masks = MasksTypes | ArrayMask | ((value?: string) => ArrayMask);

type MaskInputProps = {
	autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
	type?: InputTypes;
	mask?: Masks;
	guide?: boolean;
	value?: string;
	adjustCaret?: boolean;
	revertMask?: (s: string) => string
};

export type CustomInputProps = Omit<CurrencyInputProps, "value"> & InputProps & MaskInputProps & {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>, unmaskedValue?: string) => void
};

export type BasicMask = Function | Array<string | RegExp>;
