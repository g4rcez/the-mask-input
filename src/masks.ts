import { Mask, TheMasks, Tokens } from "./types";

const regex = {
	dots: /\./g,
	openParenthesis: /\(/g,
	closeParenthesis: /\)/g,
	leadingBars: /\\\\/g,
	escape: /[.*+?^${}()|[\]\\]/g
};

const stringPattern = (result: string) => {
	const len = result.length;
	const mask = [];
	for (let i = 0; i < len; i++) {
		const char = result[i];
		const token = originalTokens[char];
		if (token === undefined)
			mask.push(char.replace(regex.dots, "\\.").replace(regex.openParenthesis, "\\(").replace(regex.closeParenthesis, "\\)"));
		else mask.push(token.regex?.source);
	}
	return mask.join("").replace(regex.leadingBars, "\\");
};

export const createPattern = (mask: TheMasks, value: string, strict: boolean) => {
	const maskIsFunction = typeof mask === "function";
	let result: string | Mask[] = maskIsFunction ? "" : mask;
	if (maskIsFunction) {
		result = mask(value);
	}
	if (Array.isArray(result)) return createPatternRegexMask(result, strict);
	const pattern = stringPattern(result);
	return strict ? `^${pattern}$` : pattern;
};

const escape = (string: string) => string.replace(regex.escape, "\\$&");

export const createPatternRegexMask = (array: Array<string | RegExp>, strict: boolean) => {
	const mask = array.map((x) => (typeof x === "string" ? escape(x) : x.source)).join("");
	return new RegExp(strict ? `^${mask}$` : mask).source;
};

export const originalTokens: Tokens = {
	A: { regex: /[a-zA-Z]/, parse: (v: string) => v.toLocaleUpperCase() },
	H: { regex: /[a-fA-F0-9]/ },
	X: { regex: /[0-9a-zA-Z]/ },
	a: { regex: /[a-zA-Z]/, parse: (v: string) => v.toLocaleLowerCase() },
	d: { regex: /\d/, escape: true },
	x: { regex: /[a-zA-Z]/ }
};

export type Masks =
	| "uuid"
	| "cellphone"
	| "cellTelephone"
	| "cep"
	| "cnpj"
	| "color"
	| "cpf"
	| "cpfCnpj"
	| "creditCard"
	| "date"
	| "isoDate"
	| "time"
	| "int"
	| "telephone";

export type InputMode = "decimal" | "none" | "text" | "numeric" | "tel" | "search" | "email" | "url";

const digit = /\d/;

const cellphoneMask = "(dd) 9dddd-dddd";

const telephoneMask = "(dd) dddd-dddd";

const cpfMask = "ddd.ddd.ddd-dd";

const cnpjMask = "dd.ddd.ddd/dddd-dd";

const numbers = (s: string) => s.replace(/\D/g, "");

const hourStartsWithTwo = ["2", /[0-3]/, ":", /[0-5]/, /\d/];
const hour = [/[012]/, /\d/, ":", /[0-5]/, /[0-9]/];

export const masks: Record<Masks, TheMasks> = {
	time: (s) => {
		const n = numbers(s);
		const first = n[0];
		return first === "2" ? hourStartsWithTwo : hour;
	},
	cep: "ddddd-ddd",
	date: "dd/dd/dddd",
	cpf: cpfMask,
	isoDate: "dddd-dd-dd",
	cnpj: cnpjMask,
	telephone: telephoneMask,
	cellphone: cellphoneMask,
	cellTelephone: (s) => (numbers(s).length < 11 ? telephoneMask : cellphoneMask),
	creditCard: "dddd dddd dddd dddd",
	uuid: "HHHHHHHH-HHHH-HHHH-HHHH-HHHHHHHHHHHH",
	color: (v) => (v.length > 4 ? "#HHHHHH" : "#HHH"),
	cpfCnpj: (s) => (numbers(s).length <= 11 ? cpfMask : cnpjMask) as string,
	int: (s) => (digit.test(s.slice(-1)) ? "d".repeat(Math.max(s.length, 0)) : "d".repeat(Math.max(s.length - 1, 0)))
};

export type MaskConfig = {
	pattern?: string;
	inputMode: InputMode;
	mask: TheMasks;
	transform?: (s: string) => string;
	strict: boolean;
};

const mask = (mask: TheMasks, inputMode: InputMode, props: Pick<MaskConfig, "transform" | "pattern"> = {}): MaskConfig => ({
	mask,
	inputMode,
	strict: true,
	pattern: props.pattern ?? typeof mask === "function" ? undefined : createPattern(mask, "", true),
	...props
});

export const inputMaskedProps: Record<Masks, MaskConfig> = {
	cellTelephone: mask(masks.cellTelephone, "tel"),
	cellphone: mask(masks.cellphone, "tel"),
	cep: mask(masks.cep, "decimal"),
	cnpj: mask(masks.cnpj, "decimal"),
	color: mask(masks.color, "decimal", { pattern: "#[a-fA-F0-9]{3}([a-fA-F0-9]{3})?" }),
	cpf: mask(masks.cpf, "decimal"),
	cpfCnpj: mask(masks.cpfCnpj, "decimal", { transform: numbers }),
	creditCard: mask(masks.creditCard, "decimal"),
	date: mask(masks.date, "decimal"),
	int: mask(masks.int, "decimal", { pattern: "[0-9]+" }),
	isoDate: mask(masks.isoDate, "decimal"),
	telephone: mask(masks.telephone, "tel"),
	time: mask(masks.time, "decimal", { pattern: "[0-9]{2}:[0-9]{2}" }),
	uuid: mask(masks.uuid, "decimal", { pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" })
};
