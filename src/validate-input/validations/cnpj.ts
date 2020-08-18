import { OnlyNumbers } from '../../helpers/fmt';

const BLACKLIST = [
	"00000000000000",
	"11111111111111",
	"22222222222222",
	"33333333333333",
	"44444444444444",
	"55555555555555",
	"66666666666666",
	"77777777777777",
	"88888888888888",
	"99999999999999"
];

const cnpjDigit = (digits: string) => {
	let index = 2;
	const reverse = digits.split("").reduce((buffer, n) => [parseInt(n, 10), ...buffer], [] as number[]);

	const sum: number = reverse.reduce((buffer, n) => {
		const cache = index;
		index = index === 9 ? 2 : index + 1;
		return buffer + n * cache;
	}, 0);

	const mod: number = sum % 11;
	return mod < 2 ? 0 : 11 - mod;
};

export const isValidCnpj = (cnpj = "") => {
	const stripped: string = OnlyNumbers(cnpj);
	if (!stripped) {
		return false;
	}
	if (stripped.length !== 14) {
		return false;
	}
	if (BLACKLIST.includes(stripped)) {
		return false;
	}
	let numbers: string = stripped.substr(0, 12);
	numbers += cnpjDigit(numbers);
	numbers += cnpjDigit(numbers);
	return numbers.substr(-2) === stripped.substr(-2);
};
