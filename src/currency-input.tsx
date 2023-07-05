import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { addDecimals, fromValue, padding, replaceBlankSpace, valueToFloat } from "./libs";
import { CurrencyCode, CurrencyDisplay, HtmlInputProps, Locales, Value } from "./types";

export type CurrencyMaskTypes = "money" | "currency";

export const isCurrencyInput = (mask: any): mask is CurrencyMaskTypes => mask === "money" || mask === "currency";

export type CurrencyInputProps = Omit<HtmlInputProps, "value"> &
	Partial<{
		currency: CurrencyCode;
		currencyDisplay: CurrencyDisplay;
		locale: Locales;
		mask: CurrencyMaskTypes;
		value: Value;
	}>;

export const namedFormatCurrency = (locale: Locales, currency: CurrencyCode, currencyDisplay: CurrencyDisplay) =>
	new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay }).formatToParts(1000).reduce(
		(acc, el) => ({
			...acc,
			[el.type]: el.value
		}),
		{ currency: "", currencyDisplay: "", decimal: ",", fraction: "", group: "", integer: "", literal: "" }
	);

export type CurrencyInfo = ReturnType<typeof namedFormatCurrency>;

export const toCurrency = (value: string, props: CurrencyInfo) => {
	const valueToMask = padding(fromValue(value), props.fraction.length);
	const result = `${props.currency}${addDecimals(valueToMask, props.group, props.decimal)}`;
	return replaceBlankSpace(result);
};

export const CurrencyInput = forwardRef(
	(
		{ locale = "pt-BR", currency = "BRL", currencyDisplay = "symbol", mask, onChange, ...html }: CurrencyInputProps,
		externalRef: React.Ref<HTMLInputElement>
	) => {
		const ref = useRef<HTMLInputElement>(null);
		const [input, setInput] = useState<Value>(() => html.value?.toString() ?? "");
		useImperativeHandle(externalRef, () => ref.current!);

		useEffect(() => {
			if (html.value === "") return void setInput("");
			const number = Number.parseFloat(`${html.value ?? "0"}`).toFixed(info.fraction.length);
			return void setInput(toCurrency(number, info));
		}, [html.value]);

		const info = useMemo(() => {
			const infos = namedFormatCurrency(locale, currency, currencyDisplay);
			infos.currency = replaceBlankSpace(`${infos.currency.trim()} `);
			infos.literal = replaceBlankSpace(infos.literal.trim());
			return infos;
		}, [locale, currency]);

		const change = (e: React.ChangeEvent<HTMLInputElement>) => {
			const money = toCurrency(e.target.value, info);
			const realValue = valueToFloat(money);
			const cursor = e.target.selectionStart ?? 0;
			setInput(money);
			e.target.value = `${realValue}`;
			onChange?.(e);
			if (realValue !== 0) {
				ref.current!.selectionEnd = cursor + 1;
			}
		};

		return <input {...html} value={input} type="text" ref={ref} onChange={change} inputMode="decimal" />;
	}
);
