import { Locales } from "../@types/locales";
import { CurrencyCode } from "../@types/currency-code";

export const replaceBlankSpace = (str: string) => str.replace(new RegExp(String.fromCharCode(160), "g"), " ");

const fromValue = (value = "") => value.replace(/(-(?!\d))|[^0-9|-]/g, "") || "";

const padding = (digits: string, minLength: number) => {
	const currentLength = digits.length;
	const pad = minLength + 1;
	if (currentLength >= pad) {
		return digits;
	}
	const amountToAdd = pad - currentLength;
	const zeros = "0".repeat(amountToAdd);
	return `${zeros}${digits}`;
};

export const removeLeadingZeros = (num: string) => num.replace(/^0+([0-9]+)/, "$1");

type AddDecimals = {
	separator: string;
	decimalSeparator: string;
};

const addDecimals = (num: string, { separator = ".", decimalSeparator = "," }: AddDecimals) => {
	const centsStart = num.length - 2;
	const amount = removeLeadingZeros(num.substring(0, centsStart));
	const cents = num.substring(centsStart);
	return amount.split(/(?=(?:\d{3})*$)/).join(separator) + decimalSeparator + cents;
};
export type ToCurrency = {
	separator: string;
	prefix: string;
	decimalSeparator: string;
	decimalsLength: number;
};
export const toCurrency = (value: string, { separator, prefix, decimalSeparator, decimalsLength }: ToCurrency) => {
	const valueToMask = padding(fromValue(value), decimalsLength);
	const result = `${prefix}${addDecimals(valueToMask, { separator, decimalSeparator })}`;
	return replaceBlankSpace(result);
};

export const safeConvert = (str: string | number = "", props: ToCurrency) =>
	toCurrency(Number.parseFloat(`${str}`).toFixed(props.decimalsLength), props);

export const namedFormatCurrency = (locale: Locales, currency: CurrencyCode) =>
	new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(1000).reduce((acc, el) => ({ ...acc, [el.type]: el.value }), {
		currency: "",
		decimal: ",",
		fraction: "",
		group: "",
		integer: "",
		literal: ""
	});

export const currencyToFloat = (currency: string) =>
	Number.parseFloat(
		currency
			.replace(/,/g, ".")
			.replace(/(.*)\./, (x) => `${x.replace(/\./g, "")}.`)
			.replace(/[^0-9.]/g, "")
	);

export const ToInt = (str: string) => Number.parseInt(`${str}`, 10);

export const OnlyNumbers = (str: string) => str.replace(/[^0-9]+/g, "");
