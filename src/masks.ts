import { TheMasks, Tokens } from "./types";

export const originalTokens: Tokens = {
	H: { regex: /[a-fA-F0-9]/ },
	d: { regex: /\d/ },
	X: { regex: /[0-9a-zA-Z]/ },
	x: { regex: /[a-zA-Z]/ },
	A: { regex: /[a-zA-Z]/, parse: (v: string) => v.toLocaleUpperCase() },
	a: { regex: /[a-zA-Z]/, parse: (v: string) => v.toLocaleLowerCase() },
	"\\": { escape: true }
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

export const masks: Record<Masks, TheMasks> = {
	time: "dd:dd",
	cep: "ddddd-ddd",
	date: "dd/dd/dddd",
	cpf: "ddd.ddd.ddd-dd",
	isoDate: "dddd-dd-dd",
	cnpj: "dd.ddd.ddd/dddd-dd",
	telephone: "(dd) dddd-dddd",
	cellphone: "(dd) 9dddd-dddd",
	creditCard: "dddd dddd dddd dddd",
	uuid: "HHHHHHHH-HHHH-HHHH-HHHH-HHHHHHHHHHHH",
	color: (v) => (v.length > 4 ? "#HHHHHH" : "#HHH"),
	cpfCnpj: (s) => (s.length <= 11 ? masks.cpf : masks.cnpj) as string,
	cellTelephone: (v) => (v.length === 10 ? masks.telephone : masks.cellTelephone) as string,
	int: (s) => (digit.test(s.slice(-1)) ? "d".repeat(s.length) : "d".repeat(s.length - 1))
};

export type MaskConfig = { pattern: string; inputMode: InputMode; mask: TheMasks };

export const createPattern = (mask: TheMasks) => {
	if (typeof mask === "string") {
		const len = mask.length;
		const m = [];
		for (let i = 0; i < len; i++) {
			const char = mask[i];
			const token = originalTokens[char];
			token === undefined ? m.push(char) : m.push(token.regex?.source);
		}
		return m.join("").replace(/\\\\/g, "\\");
	}
	return "";
};

const mask = (mask: TheMasks, inputMode: InputMode): MaskConfig => ({ mask, pattern: createPattern(mask), inputMode });

export const inputMaskedProps: Record<Masks, MaskConfig> = {
	cellTelephone: mask(masks.cellTelephone, "tel"),
	cellphone: mask(masks.cellphone, "tel"),
	cep: mask(masks.cep, "decimal"),
	cnpj: mask(masks.cnpj, "decimal"),
	color: mask(masks.color, "decimal"),
	cpf: mask(masks.cpf, "decimal"),
	cpfCnpj: mask(masks.cpfCnpj, "decimal"),
	creditCard: mask(masks.creditCard, "decimal"),
	date: mask(masks.date, "decimal"),
	int: mask(masks.int, "decimal"),
	isoDate: mask(masks.isoDate, "decimal"),
	telephone: mask(masks.telephone, "tel"),
	time: mask(masks.time, "decimal"),
	uuid: mask(masks.uuid, "decimal")
};
