import React, { useImperativeHandle, useMemo, useRef } from "react";
import { CurrencyInputProps } from "../@types/input";
import { currencyToFloat, namedFormatCurrency, toCurrency } from "../helpers/fmt";

const PATTERN = "^[A-Z]{1,3}[0-9$,. ]+$";

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
	({ locale = "pt-BR", currency = "BRL", adjustCaret, ...html }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		useImperativeHandle(externalRef, () => ref.current!);

		const info = useMemo(() => {
			const infos = namedFormatCurrency(locale, currency);
			infos.currency = `${infos.currency.trim()} `;
			infos.literal = infos.literal.trim();
			return infos;
		}, [locale, currency]);

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
			ref.current!.value = money;
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
		return <input {...html} onClick={onClick} type="text" ref={ref} onChange={change} inputMode="decimal" pattern={PATTERN} />;
	}
);
