import React, { useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CurrencyInputProps } from "../@types/input";
import { currencyToFloat, namedFormatCurrency, toCurrency, safeConvert, ToCurrency } from "../helpers/fmt";

const PATTERN = "^[A-Z]{1,3}[0-9$,. ]+$";

const formatter = (s: string, info: ToCurrency) => toCurrency(s, info);

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
	({ locale = "pt-BR", currency = "BRL", adjustCaret, ...html }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		const [input, setInput] = useState<string>(() => `${html.value || "0"}`);
		useImperativeHandle(externalRef, () => ref.current!);

		useLayoutEffect(() => {
			const money = safeConvert(`${html.value || "0"}`, {
				decimalSeparator: info.decimal,
				decimalsLength: info.fraction.length,
				prefix: info.currency,
				separator: info.group
			});
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
			const money = formatter(e.target.value, {
				decimalSeparator: info.decimal,
				decimalsLength: info.fraction.length,
				prefix: info.currency,
				separator: info.group
			});
			const realValue = currencyToFloat(money);
			const cursor = e.target.selectionStart ?? 0;
			setInput(money);
			e.target.value = `${realValue}`;
			console.log({ money });
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
