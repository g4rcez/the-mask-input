export const convertMaskToPlaceholder = (mask: Array<RegExp | string> = [], placeholderChar: string) =>
	mask.map((char) => (char instanceof RegExp ? placeholderChar : char)).join("");

export const isString = (value: unknown) => typeof value === "string" || value instanceof String;

export const isNumber = (value: unknown) => typeof value === "number" && !Number.isNaN(value);

export const isNil = (value: unknown) => value === undefined || value === null;

export function processCaretTraps(mask: any[]) {
	const indexes = [];
	let indexOfCaretTrap;
	while (((indexOfCaretTrap = mask.indexOf("[]")), indexOfCaretTrap !== -1)) {
		indexes.push(indexOfCaretTrap);
		mask.splice(indexOfCaretTrap, 1);
	}
	return { maskWithoutCaretTraps: mask, indexes };
}
