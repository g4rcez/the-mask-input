import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { CurrencyCode, Locales, TheMaskInputProps } from "./types";

export declare type CurrencyInputProps = Omit<TheMaskInputProps, "value" | "mask"> &
	Partial<{
		currency: CurrencyCode;
		locale: Locales;
		name: string;
		onChangeText: (value: string) => void;
		onChange: (e: React.ChangeEvent<HTMLInputElement>, unmasked?: string) => void;
		value: string;
		mask: "money" | "currency";
	}>;

export const replaceBlankSpace = (str: string) => str.replace(new RegExp(String.fromCharCode(160), "g"), " ");

const padding = (digits: string, minLength: number) => {
	const currentLength = digits.length;
	const pad = minLength + 1;
	if (currentLength >= pad) return digits;
	const zeros = "0".repeat(pad - currentLength);
	return `${zeros}${digits}`;
};

export const removeLeadingZeros = (num: string) => num.replace(/^0+([0-9]+)/, "$1");

const addDecimals = (num: string, separator: string, decimalSeparator: string) => {
	const centsStart = num.length - 2;
	const amount = removeLeadingZeros(num.substring(0, centsStart));
	const cents = num.substring(centsStart);
	return amount.split(/(?=(?:\d{3})*$)/).join(separator) + decimalSeparator + cents;
};

export const namedFormatCurrency = (locale: Locales, currency: CurrencyCode) =>
	new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(1000).reduce(
		(acc, el) => ({
			...acc,
			[el.type]: el.value
		}),
		{ currency: "", decimal: ",", fraction: "", group: "", integer: "", literal: "" }
	);

export type CurrencyInfo = ReturnType<typeof namedFormatCurrency>;

const fromValue = (value = "") => value.replace(/(-(?!\d))|[^0-9|-]/g, "") || "";
export const toCurrency = (value: string, props: CurrencyInfo) => {
	const valueToMask = padding(fromValue(value), props.fraction.length);
	const result = `${props.currency}${addDecimals(valueToMask, props.group, props.decimal)}`;
	return replaceBlankSpace(result);
};

export const currencyToFloat = (currency: string) =>
	Number.parseFloat(
		currency
			.replace(/,/g, ".")
			.replace(/(.*)\./, (x) => `${x.replace(/\./g, "")}.`)
			.replace(/[^0-9.]/g, "")
	);

export const CurrencyInput = forwardRef(
	({ locale = "pt-BR", currency = "BRL", mask, onChange, ...html }: CurrencyInputProps, externalRef: React.Ref<HTMLInputElement>) => {
		const ref = useRef<HTMLInputElement>(null);
		const [input, setInput] = useState<string>(() => html.value?.toString() ?? "");
		useImperativeHandle(externalRef, () => ref.current!);

		useEffect(
			() => setInput(html.value === "" ? "" : toCurrency(Number.parseFloat(`${html.value ?? "0"}`).toFixed(info.fraction.length), info)),
			[html.value]
		);

		const info = useMemo(() => {
			const infos = namedFormatCurrency(locale, currency);
			infos.currency = replaceBlankSpace(`${infos.currency.trim()} `);
			infos.literal = replaceBlankSpace(infos.literal.trim());
			return infos;
		}, [locale, currency]);

		const change = (e: React.ChangeEvent<HTMLInputElement>) => {
			const money = toCurrency(e.target.value, info);
			const realValue = currencyToFloat(money);
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
