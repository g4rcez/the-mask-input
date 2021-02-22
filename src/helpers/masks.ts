import { ArrayMask, MasksConfig } from "../@types/input";
import { OnlyNumbers, ToInt } from "./fmt";

const TELEPHONE_MASK = ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];

const CELLPHONE_MASK = ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];

const CPF_MASK = [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/];

const CNPJ_MASK = [/\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/];

const array = (el: RegExp, len: number) => Array.from({ length: len }).map(() => el);

export const convertMask = (mask: Function | ArrayMask) => {
	const maskOutput = typeof mask === "function" ? mask("") : mask;
	return [...maskOutput].reduce((x, y) => {
		if (`${y}` === "/\\d/" || /\/\[\S+]\//.test(`${y}`)) {
			return `${x}0`;
		}
		if (`${y}` === "/[\\S]/") {
			return `${x}A`;
		}
		return `${x}${y}`;
	});
};

const getCheckedDateArray = (numbers = "", day = 0, first = /[01]/, second = /\d/) => {
	const firstDigitMonth = numbers.substring(2, 3) || "";
	if (firstDigitMonth === "1") {
		return [/[0123]/, /\d/, "/", /1/, /[02]/, "/", /\d/, /\d/, /\d/, /\d/];
	}
	if (day >= 30) {
		return [/[0123]/, /[01]/, "/", first, /[013456789]/, "/", /\d/, /\d/, /\d/, /\d/];
	}
	return [/[0123]/, /\d/, "/", first, second, "/", /\d/, /\d/, /\d/, /\d/];
};

export const maskConfig: MasksConfig = {
	isoDate: {
		pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}",
		title: "ISO Date",
		inputMode: "decimal",
		mask: [/\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/],
		revert: OnlyNumbers
	},
	time: {
		pattern: "[0-9]{2}:[0-9]{2}",
		title: "Time Hour:Minute",
		inputMode: "decimal",
		mask: [/\d/, /\d/, ":", /\d/, /\d/],
		revert: OnlyNumbers
	},

	telephone: {
		pattern: "\\([0-9]{2}\\) [0-9]{4}-[0-9]{4}",
		title: "Telephone",
		inputMode: "decimal",
		mask: TELEPHONE_MASK,
		revert: OnlyNumbers
	},
	cnpj: {
		inputMode: "decimal",
		mask: CNPJ_MASK,
		pattern: "[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9][0-9]",
		title: "CNPJ",
		revert: OnlyNumbers
	},
	cpf: {
		inputMode: "decimal",
		mask: CPF_MASK,
		pattern: "[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}",
		title: "CPF",
		revert: OnlyNumbers
	},
	cpfCnpj: {
		pattern: "([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}|[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9][0-9])",
		title: "CPF or CNPJ",
		inputMode: "decimal",
		mask: (str = "") => (OnlyNumbers(str).length <= 11 ? CPF_MASK : CNPJ_MASK),
		revert: OnlyNumbers
	},

	cep: {
		mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/],
		pattern: "[0-9]{5}-[0-9]{3}",
		title: "CEP",
		inputMode: "decimal",
		revert: OnlyNumbers
	},
	creditCard: {
		mask: [/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/],
		pattern: "[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}",
		title: "Credit Card",
		inputMode: "decimal",
		revert: OnlyNumbers
	},
	int: {
		mask: (s = "") => (/[0-9]/.test(s.slice(-1)) ? array(/\d/, s.length) : array(/\d/, s.length - 1)),
		pattern: "^[0-9]+$",
		title: "Integer number",
		inputMode: "decimal",
		revert: OnlyNumbers
	},
	cellphone: {
		mask: ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
		pattern: "\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}",
		title: "Cellphone",
		inputMode: "decimal",
		revert: OnlyNumbers
	},
	cellTelephone: {
		mask: (value = "") => (OnlyNumbers(value).length === 10 ? TELEPHONE_MASK : CELLPHONE_MASK),
		pattern: "\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}",
		title: "Telephone or cellphone",
		inputMode: "decimal",
		revert: OnlyNumbers
	},
	color: {
		pattern: "#[0-9a-fA-F]{6}",
		title: "Color",
		inputMode: "decimal",
		mask: ["#", /[\dA-Fa-f]/, /[\dA-Fa-f]/, /[\dA-Fa-f]/, /[\dA-Fa-f]/, /[\dA-Fa-f]/, /[\dA-Fa-f]/],
		revert: (s: string) => s
	},
	date: {
		pattern: "[0-9]{2}/[0-9]{2}/[0-9]{4}",
		title: "Date Day/Month/Year",
		inputMode: "decimal",
		mask: (str = "") => {
			const numbers = OnlyNumbers(str);
			if (/^3/.test(numbers)) {
				const day = ToInt(numbers.substring(0, 2) || "0");
				return getCheckedDateArray(numbers, day, /[01]/, /\d/);
			}
			return [/[0123]/, /\d/, "/", /[01]/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
		},
		revert: OnlyNumbers
	},
	email: {
		inputMode: "email",
		mask: (str = "") => {
			const atSignPosition = str.indexOf("@");
			if (atSignPosition < 0) {
				return array(/[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]/, str.length);
			}
			const beforeAtSignArray = array(/[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]/, atSignPosition);
			const domain = /[a-zA-Z0-9-.]/;
			const last = str.slice(-1);
			const afterAtSignArray = array(domain, str.length - atSignPosition - (domain.test(last) ? 1 : 2));
			return [...beforeAtSignArray, "@", ...afterAtSignArray];
		},
		pattern: "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
		title: "Email",
		revert: (s: string) => s
	}
};
