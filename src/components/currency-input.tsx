import React, { useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CurrencyInputProps } from "../@types/input";
import { currencyToFloat, namedFormatCurrency, toCurrency } from "../helpers/fmt";

const PATTERN = "^[A-Z]{1,3}[0-9$,. ]+$";

const formatter = (s: string, info: any) =>
	toCurrency(s || "0", {
		separator: info.literal,
		decimalSeparator: info.decimal,
		prefix: info.currency,
		decimalsLength: info.fraction.length
	});

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
	({ locale = "pt-BR", currency = "BRL", adjustCaret, ...html }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		const [input, setInput] = useState<string>(() => `${html.value || "0"}`);
		useImperativeHandle(externalRef, () => ref.current!);

		useLayoutEffect(() => {
			const realValue = currencyToFloat(`${html.value || "0"}`);
			const money = Intl.NumberFormat(locale, { style: "currency", currency }).format(realValue);
			setInput(money);
		}, [html.value]);

		const info = useMemo(() => {
			const infos = namedFormatCurrency(locale, currency);
			infos.currency = `${infos.currency.trim()} `.replaceAll("&nbsp;", " ");
			infos.literal = infos.literal.trim().replaceAll("&nbsp;", " ");
			return infos;
		}, [locale, currency]);

		const change = (e: React.ChangeEvent<HTMLInputElement>) => {
			e.persist();
			const money = formatter(e.target.value, info);
			const realValue = currencyToFloat(money);
			const cursor = e.target.selectionStart ?? 0;
			setInput(money);
			ref.current!.value = money;
			e.target.value = money;
			html.onChange?.(e);
			if (realValue !== 0) {
				ref.current!.selectionEnd = cursor + 1;
			}
		};

		const onClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			if (adjustCaret) {
				const last = (ref.current?.value.length || 0) + 1;
				ref.current!.setSelectionRange(last, last);
			}
			html.onClick?.(e);
		};
		return <input {...html} value={input} onClick={onClick} type="text" ref={ref} onChange={change} inputMode="decimal" pattern={PATTERN} />;
	}
);
