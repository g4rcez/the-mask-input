import React, { useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CurrencyInputProps } from "../@types/input";
import { currencyToFloat, namedFormatCurrency, safeConvert, toCurrency } from "../helpers/fmt";

export const CURRENCY_PATTERN = "^[A-Z]{1,3}[0-9$,. ]+$";

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
	({ locale = "pt-BR", currency = "BRL", adjustCaret, onChange, ...html }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		const [input, setInput] = useState<string>(() => html.value?.toString() ?? "");
		useImperativeHandle(externalRef, () => ref.current!);

		useLayoutEffect(() => {
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
			infos.currency = `${infos.currency.trim()} `.replaceAll("&nbsp;", " ");
			infos.literal = infos.literal.trim().replaceAll("&nbsp;", " ");
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

		const onClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			if (adjustCaret) {
				const last = (ref.current?.value.length || 0) + 1;
				ref.current!.setSelectionRange(last, last);
			}
			html.onClick?.(e);
		};
		return <input {...html} value={input} onClick={onClick} type="text" ref={ref} onChange={change} inputMode="decimal" />;
	}
);
