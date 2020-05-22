import { onlyNumber } from "./helpers";

const BLACKLIST = ["00000000000", "12345678909"];

const cpfDigit = (digits: string) => {
	const numbers = digits.split("").map((n) => parseInt(n, 10));
	const modulus = numbers.length + 1;
	const multiplied = numbers.map((n, index) => n * (modulus - index));
	const mod = multiplied.reduce((str, el) => str + el, 0) % 11;
	return mod < 2 ? 0 : 11 - mod;
};

export const isValidCpf = (cpf = ""): boolean => {
	const stripped: string = onlyNumber(cpf);
	if (!stripped) {
		return false;
	}
	if (stripped.length !== 11) {
		return false;
	}
	if (BLACKLIST.includes(stripped)) {
		return false;
	}
	let numbers: string = stripped.substr(0, 9);
	numbers += cpfDigit(numbers);
	numbers += cpfDigit(numbers);
	return numbers.substr(-2) === stripped.substr(-2);
};
