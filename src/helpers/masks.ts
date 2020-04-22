import { DecimalKeyboardProps } from "../@types/input";
import { FormatCNPJ, FormatCpf, OnlyNumbers, ToInt } from "./fmt";

const replacer = {
	cellphoneReplace: /(\d{2})(\d{5})(\d{4})/,
	telephoneReplace: /(\d{2})(\d{4})(\d{4})/,
	cepReplace: /(\d{5})(\d{3})/,
	isoDateReplace: /(\d{4})(\d{2})(\d{2})/,
	brDateReplace: /(\d{2})(\d{2})(\d{4})/,
	creditCardReplace: /(\d{4})(\d{4})(\d{4})(\d{4})/
};

const toCellphone = (str = "") => {
	if (str.length === 11) {
		return OnlyNumbers(str).replace(replacer.cellphoneReplace, "($1) $2-$3");
	}
	return str;
};

const toTelephone = (str = "") => {
	if (str.length === 10) {
		return OnlyNumbers(str).replace(replacer.telephoneReplace, "($1) $2-$3");
	}
	return str;
};

const checkDate = (numbers = "", day = 0, first = /[01]/, second = /\d/) => {
	const firstDigitMonth = numbers.substring(2, 3) || "";
	if (firstDigitMonth === "1") {
		return [/[0123]/, /\d/, "/", /1/, /[02]/, "/", /\d/, /\d/, /\d/, /\d/];
	}
	if (day >= 30) {
		return [/[0123]/, /\d/, "/", first, /[013456789]/, "/", /\d/, /\d/, /\d/, /\d/];
	}

	return [/[0123]/, /\d/, "/", first, second, "/", /\d/, /\d/, /\d/, /\d/];
};

export const maskConverter = {
	cellphone: toCellphone,
	telephone: toTelephone,
	cnpj: (str: string) => (str.length === 14 ? FormatCNPJ(str) : str),
	color: (str: string) => (str.length === 7 ? `#${OnlyNumbers(str)}` : str),
	cpf: (str: string) => (str.length === 11 ? FormatCpf(str) : str),
	cep: (str: string) => OnlyNumbers(str).replace(replacer.cepReplace, "$1-$2"),
	cpfCnpj: (str: string) => {
		if (str.length <= 14) {
			return FormatCpf(str);
		} else if (str.length > 14) {
			return FormatCNPJ(str);
		}
		return str;
	},
	isoDate: (str: string) => {
		if (str.length === 8) {
			return OnlyNumbers(str).replace(replacer.isoDateReplace, "$1-$2-$3");
		}
		return str;
	},
	date: (str: string) => {
		if (str.length === 8) {
			return OnlyNumbers(str).replace(replacer.brDateReplace, "$1/$2/$3");
		}
		return str;
	},
	creditCard: (str: string) => {
		if (str.length === 16) {
			return OnlyNumbers(str).replace(replacer.creditCardReplace, "$1 $2 $3 $4");
		}
		return str;
	},
	cellTelephone: (str: string) => {
		if (str.length === 10) {
			return toTelephone(str);
		}
		if (str.length === 11) {
			return toCellphone(str);
		}
		return str;
	}
};

export const masks = {
	cellphone: ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
	cep: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/],
	cnpj: [/\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/],
	color: ["#", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
	cpf: [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/],
	telephone: ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
	date: (str = "") => {
		const numbers = OnlyNumbers(str);
		const day = ToInt(numbers.substring(0, 2) || "0");
		if (/^3/.test(numbers)) {
			return checkDate(numbers, day, /[01]/, /\d/);
		}
		if (day === 31) {
			checkDate(numbers);
		}
		if (day === 30) {
			checkDate(numbers);
		}
		return [/[0123]/, /\d/, "/", /[01]/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
	},
	isoDate: [/\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/],
	creditCard: [/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/],
	cpfCnpj: (value: string = "") => {
		const mask = OnlyNumbers(value);
		return mask.length > 11 ? masks.cnpj : masks.cpf;
	},
	cellTelephone: (value: string = "") => {
		const mask = OnlyNumbers(value);
		if (mask.length === 10) {
			return masks.telephone;
		}
		return masks.cellphone;
	}
};

export function convertMaskToString(mask: any) {
	const maskOutput = typeof mask === "function" ? mask("") : mask;
	const { length } = maskOutput;
	let placeholder = "";
	for (let i = 0; i < length; i++) {
		const str = maskOutput[i];
		if (typeof str === "string") {
			placeholder += str;
		} else if (str.toString() === "/\\d/") {
			placeholder += "0";
		} else if (str.toString() === "/[\\S]/") {
			placeholder += "A";
		} else {
			placeholder += str;
		}
	}
	return placeholder;
}

export const decimalsInput = ["cpf", "cellphone", "cnpj", "cep", "telephone", "date", "cellTelephone", "cpfCnpj"];

export const decimalKeyboard: DecimalKeyboardProps = {
	date: {
		pattern: "[0-9]{2}/[0-9]{2}/[0-9]{4}",
		title: "Informe a data no padrão correto",
		inputMode: "decimal"
	},
	creditCard: {
		pattern: "[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}",
		title: "Informe o número do cartão no padrão correto",
		inputMode: "decimal"
	},
	isoDate: {
		pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}",
		title: "Informe a data no padrão correto",
		inputMode: "decimal"
	},
	cpf: {
		pattern: "[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}",
		title: "Informe o CPF no padrão correto",
		inputMode: "decimal"
	},
	cellphone: {
		pattern: "\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}",
		title: "Informe o celular no padrão correto",
		inputMode: "decimal"
	},
	cnpj: {
		pattern: "[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9][0-9]",
		title: "Informe o CNPJ no padrão correto",
		inputMode: "decimal"
	},
	cep: {
		pattern: "[0-9]{5}-[0-9]{3}",
		title: "Informe o CEP no padrão correto",
		inputMode: "decimal"
	},
	color: {
		pattern: "#[0-9]{6}",
		title: "Informe a cor no padrão correto",
		inputMode: "decimal"
	},
	telephone: {
		pattern: "\\([0-9]{2}\\) [0-9]{4}-[0-9]{4}",
		title: "Informe o telefone no padrão correto",
		inputMode: "decimal"
	},
	cellTelephone: {
		pattern: "\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}",
		title: "Informe o telefone/celular no padrão correto",
		inputMode: "decimal"
	},
	cpfCnpj: {
		pattern: "[0-9./-]+",
		title: "Informe o CPF/CNPJ no padrão correto",
		inputMode: "decimal"
	}
};
