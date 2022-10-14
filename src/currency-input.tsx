import React, { useEffect, useLayoutEffect, useCallback, useImperativeHandle, useMemo, useRef, useState, forwardRef } from "react";
import { CurrencyCode, Locales, TheMaskInputProps } from "./types";

export type ToCurrency = {
	separator: string;
	prefix: string;
	decimalSeparator: string;
	decimalsLength: number;
};

export declare type CurrencyInputProps = Omit<TheMaskInputProps, "value" | "mask"> &
	Partial<{
		currency: CurrencyCode;
		locale: Locales;
		name: string;
		onChange: (e: React.ChangeEvent<HTMLInputElement>, unmasked?: string) => void;
		value: string;
		mask: "money" | "currency";
	}>;

export const useIsoEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

export const replaceBlankSpace = (str: string) => str.replace(new RegExp(String.fromCharCode(160), "g"), " ");

const fromValue = (value = "") => value.replace(/(-(?!\d))|[^0-9|-]/g, "") || "";

const padding = (digits: string, minLength: number) => {
	const currentLength = digits.length;
	const pad = minLength + 1;
	if (currentLength >= pad) {
		return digits;
	}
	const amountToAdd = pad - currentLength;
	const zeros = "0".repeat(amountToAdd);
	return `${zeros}${digits}`;
};

export const removeLeadingZeros = (num: string) => num.replace(/^0+([0-9]+)/, "$1");

type AddDecimals = {
	separator: string;
	decimalSeparator: string;
};

const addDecimals = (num: string, { separator = ".", decimalSeparator = "," }: AddDecimals) => {
	const centsStart = num.length - 2;
	const amount = removeLeadingZeros(num.substring(0, centsStart));
	const cents = num.substring(centsStart);
	return amount.split(/(?=(?:\d{3})*$)/).join(separator) + decimalSeparator + cents;
};

export const toCurrency = (value: string, { separator, prefix, decimalSeparator, decimalsLength }: ToCurrency) => {
	const valueToMask = padding(fromValue(value), decimalsLength);
	const result = `${prefix}${addDecimals(valueToMask, { separator, decimalSeparator })}`;
	return replaceBlankSpace(result);
};

export const safeConvert = (str: string | number = "", props: ToCurrency) =>
	toCurrency(Number.parseFloat(`${str}`).toFixed(props.decimalsLength), props);

export const namedFormatCurrency = (locale: Locales, currency: CurrencyCode) =>
	new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(1000).reduce(
		(acc, el) => ({
			...acc,
			[el.type]: el.value
		}),
		{
			currency: "",
			decimal: ",",
			fraction: "",
			group: "",
			integer: "",
			literal: ""
		}
	);

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

		useIsoEffect(() => {
			if (html.value == "") {
				return setInput("");
			}
			const money = safeConvert(`${html.value ?? "0"}`, {
				decimalSeparator: info.decimal,
				decimalsLength: info.fraction.length,
				prefix: info.currency,
				separator: info.group
			});
			setInput(money);
		}, [html.value]);

		const info = useMemo(() => {
			const infos = namedFormatCurrency(locale, currency);
			infos.currency = replaceBlankSpace(`${infos.currency.trim()} `);
			infos.literal = replaceBlankSpace(infos.literal.trim());
			return infos;
		}, [locale, currency]);

		const change = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				e.persist();
				const money = toCurrency(e.target.value, {
					decimalSeparator: info.decimal,
					decimalsLength: info.fraction.length,
					prefix: info.currency,
					separator: info.group
				});
				const realValue = currencyToFloat(money);
				const cursor = e.target.selectionStart ?? 0;
				setInput(money);
				e.target.value = `${realValue}`;
				onChange?.(e);
				if (realValue !== 0) {
					ref.current!.selectionEnd = cursor + 1;
				}
			},
			[info, onChange]
		);

		return <input {...html} value={input} type="text" ref={ref} onChange={change} inputMode="decimal" />;
	}
);
