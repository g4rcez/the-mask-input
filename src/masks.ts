import { TheMasks, Tokens } from "./types";

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

export type MaskConfig = { pattern?: string; inputMode: InputMode; mask: TheMasks; transform?: (s: string) => string };

const mask = (mask: TheMasks, inputMode: InputMode, props: Pick<MaskConfig, "transform" | "pattern"> = {}): MaskConfig => ({
	mask,
	inputMode,
	...props
});

export const inputMaskedProps: Record<Masks, MaskConfig> = {
	cellTelephone: mask(masks.cellTelephone, "tel"),
	cellphone: mask(masks.cellphone, "tel"),
	cep: mask(masks.cep, "decimal"),
	cnpj: mask(masks.cnpj, "decimal"),
	color: mask(masks.color, "decimal", { pattern: "#[a-fA-F0-9]{3}([a-fA-F0-9]{3})" }),
	cpf: mask(masks.cpf, "decimal"),
	cpfCnpj: mask(masks.cpfCnpj, "decimal", { transform: numbers }),
	creditCard: mask(masks.creditCard, "decimal"),
	date: mask(masks.date, "decimal"),
	int: mask(masks.int, "decimal", { pattern: "[0-9]+" }),
	isoDate: mask(masks.isoDate, "decimal"),
	telephone: mask(masks.telephone, "tel"),
	time: mask(masks.time, "decimal"),
	uuid: mask(masks.uuid, "decimal")
};
