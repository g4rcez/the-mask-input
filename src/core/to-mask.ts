import { convertMaskToPlaceholder, processCaretTraps } from "../helpers/utilities";
import { BasicMask } from "../@types/input";

export const toMask = (rawValue: string = "", mask: BasicMask[] = [], config = {}) => {
	if (typeof mask === "function") {
		mask = (mask as Function)(rawValue, config);
		mask = processCaretTraps(mask).maskWithoutCaretTraps;
	}
	const {
		guide,
		previousConformedValue = "",
		placeholderChar = "_",
		placeholder = convertMaskToPlaceholder(mask as never[], placeholderChar),
		currentCaretPosition,
		keepCharPositions
	} = config as any;

	const suppressGuide = guide === false && previousConformedValue !== undefined;
	const rawValueLength = rawValue.length;
	const previousConformedValueLength = previousConformedValue.length;
	const placeholderLength = placeholder.length;
	const maskLength = mask.length;
	const editDistance = rawValueLength - previousConformedValueLength;
	const isAddition = editDistance > 0;
	const indexOfFirstChange = currentCaretPosition + (isAddition ? -editDistance : 0);
	const indexOfLastChange = indexOfFirstChange + Math.abs(editDistance);

	if (keepCharPositions === true && !isAddition) {
		let compensatingPlaceholderChars = "";
		for (let i = indexOfFirstChange; i < indexOfLastChange; i++) {
			if (placeholder[i] === placeholderChar) {
				compensatingPlaceholderChars += placeholderChar;
			}
		}
		rawValue = rawValue.slice(0, indexOfFirstChange) + compensatingPlaceholderChars + rawValue.slice(indexOfFirstChange, rawValueLength);
	}
	const rawValueArr = rawValue.split("").map((char, i) => ({ char, isNew: i >= indexOfFirstChange && i < indexOfLastChange }));

	for (let i = rawValueLength - 1; i >= 0; i--) {
		const { char } = rawValueArr[i];
		if (char !== placeholderChar) {
			const shouldOffset = i >= indexOfFirstChange && previousConformedValueLength === maskLength;
			if (char === placeholder[shouldOffset ? i - editDistance : i]) {
				rawValueArr.splice(i, 1);
			}
		}
	}
	let conformedValue = "";
	let someCharsRejected = false;

	placeholderLoop: for (let i = 0; i < placeholderLength; i++) {
		const charInPlaceholder = placeholder[i];
		if (charInPlaceholder === placeholderChar) {
			if (rawValueArr.length > 0) {
				while (rawValueArr.length > 0) {
					const { char: rawValueChar, isNew } = rawValueArr.shift() as any;
					if (rawValueChar === placeholderChar && suppressGuide !== true) {
						conformedValue += placeholderChar;
						continue placeholderLoop;
					} else if ((mask as any)[i].test(rawValueChar)) {
						if (keepCharPositions !== true || isNew === false || previousConformedValue === "" || guide === false || !isAddition) {
							conformedValue += rawValueChar;
						} else {
							const rawValueArrLength = rawValueArr.length;
							let indexOfNextAvailablePlaceholderChar = null;
							for (let i = 0; i < rawValueArrLength; i++) {
								const charData = rawValueArr[i];

								if (charData.char !== placeholderChar && charData.isNew === false) {
									break;
								}

								if (charData.char === placeholderChar) {
									indexOfNextAvailablePlaceholderChar = i;
									break;
								}
							}
							if (indexOfNextAvailablePlaceholderChar !== null) {
								conformedValue += rawValueChar;
								rawValueArr.splice(indexOfNextAvailablePlaceholderChar, 1);
							} else {
								i--;
							}
						}
						continue placeholderLoop;
					} else {
						someCharsRejected = true;
					}
				}
			}
			if (suppressGuide === false) {
				conformedValue += placeholder.substr(i, placeholderLength);
			}
			break;
		} else {
			conformedValue += charInPlaceholder;
		}
	}
	if (suppressGuide && isAddition === false) {
		let indexOfLastFilledPlaceholderChar = null;
		for (let i = 0; i < conformedValue.length; i++) {
			if (placeholder[i] === placeholderChar) {
				indexOfLastFilledPlaceholderChar = i;
			}
		}
		if (indexOfLastFilledPlaceholderChar !== null) {
			conformedValue = conformedValue.substr(0, indexOfLastFilledPlaceholderChar + 1);
		} else {
			conformedValue = "";
		}
	}
	return { conformedValue, meta: { someCharsRejected } };
};
