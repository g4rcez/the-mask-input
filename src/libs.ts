import { originalTokens } from "./masks";
import { Mask, TheMasks } from "./types";

export const replaceBlankSpace = (str: string) => str.replace(new RegExp(String.fromCharCode(160), "g"), " ");

export const padding = (digits: string, minLength: number) => {
	const currentLength = digits.length;
	const pad = minLength + 1;
	if (currentLength >= pad) return digits;
	const zeros = "0".repeat(pad - currentLength);
	return `${zeros}${digits}`;
};

export const removeLeadingZeros = (num: string) => num.replace(/^0+([0-9]+)/, "$1");

export const addDecimals = (num: string, separator: string, decimalSeparator: string) => {
	const centsStart = num.length - 2;
	const amount = removeLeadingZeros(num.substring(0, centsStart));
	const cents = num.substring(centsStart);
	return amount.split(/(?=(?:\d{3})*$)/).join(separator) + decimalSeparator + cents;
};

export const fromValue = (value = "") => value.replace(/(-(?!\d))|[^0-9|-]/g, "") || "";

export const valueToFloat = (value: string) =>
	Number.parseFloat(
		value
			.replace(/,/g, ".")
			.replace(/(.*)\./, (x) => `${x.replace(/\./g, "")}.`)
			.replace(/[^0-9.]/g, "")
	);

export const has = <T extends {}>(obj: T, key: keyof T | string): key is keyof T => Object.prototype.hasOwnProperty.call(obj, key);

export const stringPattern = (result: string) => {
	const len = result.length;
	const mask = [];
	for (let i = 0; i < len; i++) {
		const char = result[i];
		const token = originalTokens[char];
		if (token === undefined) mask.push(char.replace(/\./g, "\\.").replace(/\(/g, "\\(").replace(/\)/g, "\\)"));
		else mask.push(token.regex?.source);
	}
	return mask.join("").replace(/\\\\/g, "\\");
};

export const createPattern = (mask: TheMasks, value: string, strict: boolean) => {
	const maskIsFunction = typeof mask === "function";
	let result: string | Mask[] = maskIsFunction ? "" : mask;
	if (maskIsFunction) {
		result = mask(value);
	}
	if (typeof result !== "string") return "";
	const pattern = stringPattern(result);
	return strict ? `^${pattern}$` : pattern;
};
