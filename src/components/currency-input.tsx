import React, { useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CurrencyInputProps } from "../@types/input";
import { currencyToFloat, namedFormatCurrency, toCurrency } from "../helpers/fmt";

const PATTERN = "^[A-Z]{1,3}[0-9$,. ]+$";

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
	({ locale = "pt-BR", currency = "BRL", adjustCaret, ...html }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		const [input, setInput] = useState<string>(() => `${html.value || "0"}`);

		useLayoutEffect(() => {
			const realValue = currencyToFloat(`${html.value || "0"}`);
			const money = Intl.NumberFormat(locale, { style: "currency", currency }).format(realValue);
			setInput(money);
		}, []);

		const info = useMemo(() => {
			const infos = namedFormatCurrency(locale, currency);
			infos.currency = `${infos.currency.trim()} `;
			infos.literal = infos.literal.trim();
			return infos;
		}, [locale, currency]);

		useImperativeHandle(externalRef, () => ref.current!);

		const change = (e: React.ChangeEvent<HTMLInputElement>) => {
			e.persist();
			const money = toCurrency(e.target.value, {
				separator: info.literal,
				decimalSeparator: info.decimal,
				prefix: info.currency,
				decimalsLength: info.fraction.length
			});
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
