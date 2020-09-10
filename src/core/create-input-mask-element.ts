import { adjustCaretPosition } from "./adjust-caret-position";
import { toMask } from "./to-mask";
import { convertMaskToPlaceholder, isNumber, isString, processCaretTraps } from "../helpers/utilities";

const emptyString = "";
const strNone = "none";
const strObject = "object";

const isAndroid = window.navigator !== undefined && /Android/i.test(navigator.userAgent);
const defer = window.requestAnimationFrame !== undefined ? window.requestAnimationFrame : setTimeout;

type Config = {
	inputElement: HTMLInputElement;
	mask?: any;
	guide?: boolean;
	pipe?: any;
	placeholderChar?: string;
	keepCharPositions?: boolean;
	showMask?: boolean;
};

type State = { previousConformedValue?: string; previousPlaceholder?: string };
export const createInputMaskElement = (config: Config) => {
	const state: State = { previousConformedValue: undefined, previousPlaceholder: undefined };

	return {
		state,
		update(
			rawValue?: string,
			{ inputElement, mask: providedMask, guide = true, pipe, placeholderChar = "_", keepCharPositions = false, showMask = true } = config
		) {
			if (rawValue === undefined) {
				rawValue = inputElement.value;
			}
			if (rawValue === state.previousConformedValue) {
				return;
			}
			if (typeof providedMask === strObject && providedMask.pipe !== undefined && providedMask.mask !== undefined) {
				pipe = providedMask.pipe;
				providedMask = providedMask.mask;
			}

			let placeholder;
			let mask;
			if (Array.isArray(providedMask)) {
				placeholder = convertMaskToPlaceholder(providedMask, placeholderChar);
			}

			const safeRawValue = getSafeRawValue(rawValue);
			const currentCaretPosition = inputElement.selectionEnd;
			const { previousConformedValue, previousPlaceholder } = state;

			let caretTrapIndexes;

			if (typeof providedMask === "function") {
				mask = providedMask(safeRawValue, { currentCaretPosition, previousConformedValue, placeholderChar });
				if (mask === false) {
					return;
				}
				const result = processCaretTraps(mask);
				const indexes = result.indexes;
				const maskWithoutCaretTraps = result.maskWithoutCaretTraps;
				mask = maskWithoutCaretTraps;
				caretTrapIndexes = indexes;
				placeholder = convertMaskToPlaceholder(mask, placeholderChar);
			} else {
				mask = providedMask;
			}

			const conformToMaskConfig = {
				previousConformedValue,
				guide,
				placeholderChar,
				pipe,
				placeholder,
				currentCaretPosition,
				keepCharPositions
			};

			const conformedValue = toMask(safeRawValue, mask, conformToMaskConfig).conformedValue;
			const piped = typeof pipe === "function";

			let pipeResults = {};

			if (piped) {
				pipeResults = pipe(conformedValue, { rawValue: safeRawValue, ...conformToMaskConfig });
				if (pipeResults === false) {
					pipeResults = { value: previousConformedValue, rejected: true };
				} else if (isString(pipeResults)) {
					pipeResults = { value: pipeResults };
				}
			}
			const finalConformedValue = piped ? (pipeResults as any).value : conformedValue;
			const adjustedCaretPosition = adjustCaretPosition({
				previousConformedValue,
				previousPlaceholder,
				conformedValue: finalConformedValue,
				placeholder,
				rawValue: safeRawValue,
				currentCaretPosition,
				placeholderChar,
				indexesOfPipedChars: (pipeResults as any).indexesOfPipedChars,
				caretTrapIndexes
			});
			const inputValueShouldBeEmpty = finalConformedValue === placeholder && adjustedCaretPosition === 0;
			const emptyValue = showMask ? placeholder : emptyString;
			const inputElementValue = inputValueShouldBeEmpty ? emptyValue : finalConformedValue;
			state.previousConformedValue = inputElementValue;
			state.previousPlaceholder = placeholder;
			if (inputElement.value === inputElementValue) {
				return;
			}
			inputElement.value = inputElementValue;
			safeSetSelection(inputElement, adjustedCaretPosition!);
		}
	};
};

const safeSetSelection = (element: HTMLInputElement, selectionPosition: number) => {
	if (document.activeElement === element) {
		if (isAndroid) {
			defer(() => element.setSelectionRange(selectionPosition, selectionPosition, strNone), 0);
		} else {
			element.setSelectionRange(selectionPosition, selectionPosition, strNone);
		}
	}
};

const getSafeRawValue = (inputValue: any) => {
	if (isString(inputValue)) {
		return inputValue;
	}
	if (isNumber(inputValue)) {
		return String(inputValue);
	}
	if (inputValue === undefined || inputValue === null) {
		return emptyString;
	}
	throw new Error(
		"The 'value' provided to Text Mask needs to be a string or a number. The value " + `received was:\n\n ${JSON.stringify(inputValue)}`
	);
};
