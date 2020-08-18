import { OnlyNumbers } from "../../helpers/fmt";

export const isValidPis = (p: string) => {
	const base = "3298765432";
	let sum = 0;
	let rest = 0;
	let idvBase = 99;
	let multiplying = 0;
	let multiplier = 0;
	let idv = 99;
	let i;
	let calcRest = 0;

	const pis = OnlyNumbers(p);

	if (pis.length !== 11 || pis === "00000000000") {
		calcRest = calcRest--;
	} else {
		for (i = 0; i < 10; i++) {
			multiplying = Number.parseInt(pis.substring(i, i + 1), 10);
			multiplier = Number.parseInt(base.substring(i, i + 1), 10);

			sum += multiplying * multiplier;
		}
		rest = sum % 11;
		if (rest > 0) {
			idvBase = 11 - rest;
		} else {
			idvBase = 0;
		}
		idv = Number.parseInt(pis.substring(10, 11), 10);
		if (idvBase !== idv) {
			calcRest--;
		}
	}
	return calcRest === 0;
};
