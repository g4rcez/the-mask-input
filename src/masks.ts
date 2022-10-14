import { Mask, TheMasks, Tokens } from "./types";

export const originalTokens: Tokens = {
	H: { regex: /[a-fA-F0-9]/ },
	d: { regex: /\d/ },
	X: { regex: /[0-9a-zA-Z]/ },
	x: { regex: /[a-zA-Z]/ },
	A: { regex: /[a-zA-Z]/, parse: (v: string) => v.toLocaleUpperCase() },
	a: { regex: /[a-zA-Z]/, parse: (v: string) => v.toLocaleLowerCase() }
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

const digit = /[0-9]/;

const cellphoneMask = "(dd) 9dddd-dddd";

const telephoneMask = "(dd) dddd-dddd";

const cpfMask = "ddd.ddd.ddd-dd";

const cnpjMask = "dd.ddd.ddd/dddd-dd";

const numbers = (s: string) => s.replace(/\D/g, "");

export const masks: Record<Masks, TheMasks> = {
	time: "dd:dd",
	cep: "ddddd-ddd",
	date: "dd/dd/dddd",
	cpf: cpfMask,
	isoDate: "dddd-dd-dd",
	cnpj: cnpjMask,
	telephone: telephoneMask,
	cellphone: cellphoneMask,
	cellTelephone: (s) => (numbers(s).length <= 11 ? telephoneMask : cellphoneMask),
	creditCard: "dddd dddd dddd dddd",
	uuid: "HHHHHHHH-HHHH-HHHH-HHHH-HHHHHHHHHHHH",
	color: (v) => (v.length > 4 ? "#HHHHHH" : "#HHH"),
	cpfCnpj: (s) => (numbers(s).length <= 11 ? cpfMask : cnpjMask) as string,
	int: (s) => (digit.test(s.slice(-1)) ? "d".repeat(Math.max(s.length, 0)) : "d".repeat(Math.max(s.length - 1, 0)))
};

export type MaskConfig = { pattern: string; inputMode: InputMode; mask: TheMasks };

export const createPattern = (mask: TheMasks, value: string) => {
	const maskIsFunction = typeof mask === "function";
	let result: string | Mask[] = maskIsFunction ? "" : mask;
	if (maskIsFunction) {
		result = mask(value);
	}
	if (typeof result === "string") {
		const len = result.length;
		const m = [];
		for (let i = 0; i < len; i++) {
			const char = result[i];
			const token = originalTokens[char];
			token === undefined ? m.push(char.replace(/\./g, "\\.").replace(/\(/g, "\\(").replace(/\)/g, "\\)")) : m.push(token.regex?.source);
		}
		console.log(mask, value, m);
		return m.join("").replace(/\\\\/g, "\\");
	}
	return "";
};

const mask = (mask: TheMasks, value: string, inputMode: InputMode, pattern?: string): MaskConfig => ({
	mask,
	inputMode,
	pattern: pattern ?? createPattern(mask, value)
});

export const inputMaskedProps: Record<Masks, (value: string) => MaskConfig> = {
	cellTelephone: (v) => mask(masks.cellTelephone, v, "tel"),
	cellphone: (v) => mask(masks.cellphone, v, "tel"),
	cep: (v) => mask(masks.cep, v, "decimal"),
	cnpj: (v) => mask(masks.cnpj, v, "decimal"),
	color: (v) => mask(masks.color, v, "decimal","#[a-fA-F0-9]{3}([a-fA-F0-9])"),
	cpf: (v) => mask(masks.cpf, v, "decimal"),
	cpfCnpj: (v) => mask(masks.cpfCnpj, v, "decimal"),
	creditCard: (v) => mask(masks.creditCard, v, "decimal"),
	date: (v) => mask(masks.date, v, "decimal"),
	int: (v) => mask(masks.int, v, "decimal", "[0-9]+"),
	isoDate: (v) => mask(masks.isoDate, v, "decimal"),
	telephone: (v) => mask(masks.telephone, v, "tel"),
	time: (v) => mask(masks.time, v, "decimal"),
	uuid: (v) => mask(masks.uuid, v, "decimal")
};
