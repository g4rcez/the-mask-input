import { MasksConfig, ArrayMask } from "../@types/input";
import { FormatCNPJ, FormatCpf, OnlyNumbers, removeLeadingZeros, ToInt } from "./fmt";

const TELEPHONE_MASK = ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];

const CELLPHONE_MASK = ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];

const CPF_MASK = [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/];

const CNPJ_MASK = [/\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/];

const array = (el: RegExp, len: number) => Array.from({ length: len }).map(() => el);

const toCellphone = (str = "") => (str.length === 11 ? OnlyNumbers(str).replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3") : str);

const toTelephone = (str = "") => (str.length === 10 ? OnlyNumbers(str).replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3") : str);

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
		return [/[0123]/, /\d/, "/", first, /[013456789]/, "/", /\d/, /\d/, /\d/, /\d/];
	}
	return [/[0123]/, /\d/, "/", first, second, "/", /\d/, /\d/, /\d/, /\d/];
};

export const maskConfig: MasksConfig = {
	isoDate: {
		pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}",
		title: "Informe a data no padrão correto",
		inputMode: "decimal",
		mask: [/\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/],
		convert: (str = "") => (str.length === 8 ? OnlyNumbers(str).replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : str)
	},
	cpfCnpj: {
		pattern: "[0-9./-]+",
		title: "Informe o CPF/CNPJ no padrão correto",
		inputMode: "decimal",
		mask: (str = "") => (OnlyNumbers(str).length > 11 ? CNPJ_MASK : CPF_MASK),
		convert: (str = "") => (str.length > 14 ? FormatCNPJ(str) : FormatCpf(str))
	},
	telephone: {
		pattern: "\\([0-9]{2}\\) [0-9]{4}-[0-9]{4}",
		title: "Informe o telefone no padrão correto",
		inputMode: "decimal",
		mask: TELEPHONE_MASK,
		convert: toTelephone
	},
	cnpj: {
		convert: (str = "") => (str.length === 14 ? FormatCNPJ(str) : str),
		mask: CNPJ_MASK,
		pattern: "[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9][0-9]",
		title: "Informe o CNPJ no padrão correto",
		inputMode: "decimal"
	},
	cep: {
		mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/],
		pattern: "[0-9]{5}-[0-9]{3}",
		convert: (str = "") => OnlyNumbers(str).replace(/^(\d{5})(\d{3})$/, "$1-$2"),
		title: "Informe o CEP no padrão correto",
		inputMode: "decimal"
	},
	creditCard: {
		mask: [/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/],
		pattern: "[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}",
		title: "Informe o número do cartão no padrão correto",
		inputMode: "decimal",
		convert: (str = "") => (str.length === 16 ? OnlyNumbers(str).replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, "$1 $2 $3 $4") : str)
	},
	int: {
		mask: (s = "") => {
			const last = s.slice(-1);
			const first = s.slice(0, 1);
			if (first === "0") {
				return ["0"];
			}
			return /[0-9]/.test(last) ? array(/\d/, s.length) : array(/\d/, s.length - 1);
		},
		pattern: "[0-9]+$",
		title: "Informe um número inteiro",
		inputMode: "decimal",
		convert: (str = "") => OnlyNumbers(removeLeadingZeros(str))
	},
	cpf: {
		convert: (str = "") => (str.length === 11 ? FormatCpf(str) : str),
		mask: CPF_MASK,
		pattern: "[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}",
		title: "Informe o CPF no padrão correto",
		inputMode: "decimal"
	},
	cellphone: {
		mask: ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
		pattern: "\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}",
		title: "Informe o celular no padrão correto",
		inputMode: "decimal",
		convert: toCellphone
	},
	cellTelephone: {
		mask: (value = "") => (OnlyNumbers(value).length === 10 ? TELEPHONE_MASK : CELLPHONE_MASK),
		pattern: "\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}",
		title: "Informe o telefone/celular no padrão correto",
		inputMode: "decimal",
		convert: (str = "") => (str.length === 10 ? toTelephone(str) : str)
	},
	color: {
		pattern: "#[0-9a-fA-F]{6}",
		title: "Informe a cor no padrão correto",
		inputMode: "decimal",
		mask: ["#", /[\dA-Fa-f]/, /[\dA-Fa-f]/, /[\dA-Fa-f]/, /[\dA-Fa-f]/, /[\dA-Fa-f]/, /[\dA-Fa-f]/],
		convert: (str = "") => (str.length === 7 ? `#${str}` : str)
	},
	date: {
		pattern: "[0-9]{2}/[0-9]{2}/[0-9]{4}",
		title: "Informe a data no padrão correto",
		inputMode: "decimal",
		convert: (str = "") => (str.length === 8 ? OnlyNumbers(str).replace(/^(\d{2})(\d{2})(\d{4})$/, "$1/$2/$3") : str),
		mask: (str = "") => {
			const numbers = OnlyNumbers(str);
			const day = ToInt(numbers.substring(0, 2) || "0");
			if (/^3/.test(numbers)) {
				return getCheckedDateArray(numbers, day, /[01]/, /\d/);
			}
			return [/[0123]/, /\d/, "/", /[01]/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
		}
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
		title: "Informe o email correto",
		convert: (str = "") => str
	}
};
