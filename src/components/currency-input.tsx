import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { addDecimals, fromValue, padding, replaceBlankSpace, valueToFloat } from "../libs";
import type { CurrencyCode, CurrencyDisplay, HtmlInputProps, Locales, Value } from "../types";

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
		{ locale = "pt-BR", currency = "BRL", currencyDisplay = "symbol", mask, onChange, ...props }: CurrencyInputProps,
		externalRef: React.Ref<HTMLInputElement>
	) => {
		const ref = useRef<HTMLInputElement>(null);
		useImperativeHandle(externalRef, () => ref.current!);

		const info = useMemo(() => {
			const infos = namedFormatCurrency(locale, currency, currencyDisplay);
			infos.currency = replaceBlankSpace(`${infos.currency.trim()} `);
			infos.literal = replaceBlankSpace(infos.literal.trim());
			return infos;
		}, [locale, currency]);

		const change = (e: React.ChangeEvent<HTMLInputElement>) => {
			const money = toCurrency(e.target.value, info);
			const number = valueToFloat(money);
			e.target.value = money;
			e.target.setAttribute("data-number", number.toString());
			onChange?.(e);
			if (number !== 0) ref.current!.selectionEnd = money.length;
		};

		useEffect(() => {
			if (ref.current === null) return;
			const value = ref.current.value;
			if (value === "") return;
			const money = toCurrency(value, info);
			const number = valueToFloat(money);
			ref.current.value = money;
			ref.current.setAttribute("data-number", number.toString());
			const event = new InputEvent("change", {});
			onChange?.({ ...event, target: ref.current, currentTarget: ref.current } as any);
			if (number !== 0) ref.current!.selectionEnd = money.length;
		}, [info]);

		const defaultValue = props.defaultValue ? toCurrency(props.defaultValue as string, info) : undefined;

		return (
			<input
				{...props}
				value={typeof props.value === "string" ? toCurrency(props.value, info) : props.value}
				defaultValue={defaultValue}
				type="text"
				ref={ref}
				onChange={change}
				inputMode="decimal"
			/>
		);
	}
);
