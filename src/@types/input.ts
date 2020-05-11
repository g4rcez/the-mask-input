import { Masks } from './masks';
import { CurrencyInputProps } from '../components/currency-input';

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
	| "pis"
	| "telephone";

export type DecimalKeyboard = Exclude<MasksTypes, "currency">;

export type KeyboardProp = {
	pattern: string;
	title: string;
	inputMode: InputMode;
};
export type DecimalKeyboardProps = { [key in DecimalKeyboard]: KeyboardProp };

export type MaskInputProps = {
	autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
	type?: InputTypes;
	mask?: Masks;
	value?: string;
};

export type CustomInputProps = Omit<CurrencyInputProps, "value"> & InputProps & MaskInputProps;
