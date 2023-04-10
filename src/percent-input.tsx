import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { addDecimals, fromValue, padding, replaceBlankSpace, valueToFloat } from "./libs";
import { Locales, MaskInputProps, Value } from "./types";

const CHAR_BETWEEN_VALUE_AND_SYMBOL = 1;

export type PercentInputMask = "percentage" | "percent" | "percentual";

export const isPercentageInput = (mask: any): mask is PercentInputMask => mask === "percentage" || mask === "percent" || mask === "percentual";

export type PercentInputProps = Omit<MaskInputProps, "value" | "mask"> &
	Partial<{
		locale: Locales;
		mask: PercentInputMask;
		value: Value;
	}>;

export const namedFormatPercent = (locale: Locales) =>
	new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: 2 }).formatToParts(1000).reduce(
		(acc, el) => ({
			...acc,
			[el.type]: el.value
		}),
		{ decimal: "", fraction: "", group: "", integer: "", percentSign: "", type: "", value: "" }
	);

export type PercentageInfo = ReturnType<typeof namedFormatPercent>;

export const toPercent = (value: string, props: PercentageInfo) => {
	const valueToMask = padding(fromValue(value), props.fraction.length);
	const result = `${addDecimals(valueToMask, props.group, props.decimal)} ${props.percentSign}`;
	return replaceBlankSpace(result);
};

export const PercentageInput = forwardRef(
	({ locale = "pt-BR", mask, onChange, onKeyUp, ...html }: PercentInputProps, externalRef: React.Ref<HTMLInputElement>) => {
		const ref = useRef<HTMLInputElement>(null);
		const [input, setInput] = useState<string>(() => html.value?.toString() ?? "");
		useImperativeHandle(externalRef, () => ref.current!);

		useEffect(() => {
			const number = Number.parseFloat(`${html.value ?? "0"}`).toFixed(info.fraction.length);
			setInput(toPercent(number, info));
		}, [html.value]);

		const info = useMemo(() => {
			const infos = namedFormatPercent(locale);
			infos.percentSign = replaceBlankSpace(`${infos.percentSign}`);
			return infos;
		}, [locale]);

		const valueLength = input.length - info.percentSign.length - CHAR_BETWEEN_VALUE_AND_SYMBOL;

		const focusNumber = () => {
			const inputElement = ref.current;
			if (!inputElement) return;
			inputElement.setSelectionRange(valueLength, valueLength);
		};

		const keyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
			const target = event.currentTarget;
			if (target.selectionStart !== null) {
				const { selectionStart, selectionEnd } = target;
				const isSelection = selectionStart !== selectionEnd;
				const cursorIsOnSymbol = valueLength < selectionStart;
				if (!isSelection && cursorIsOnSymbol) {
					focusNumber();
				}
			}
			onKeyUp?.(event);
		};

		const change = (e: React.ChangeEvent<HTMLInputElement>) => {
			const percent = toPercent(e.target.value, info);
			const realValue = valueToFloat(percent);
			setInput(percent);
			e.target.value = `${realValue}`;
			onChange?.(e);
		};

		useEffect(() => {
			focusNumber();
		}, [input]);

		return <input {...html} value={input} type="text" ref={ref} onChange={change} onFocus={focusNumber} onKeyUp={keyUp} inputMode="decimal" />;
	}
);
