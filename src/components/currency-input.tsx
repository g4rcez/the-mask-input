import React, { useCallback, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { CurrencyInputProps } from "../@types/input";
import { currencyToFloat } from "../helpers/fmt";

const PATTERN = "^[A-Z]{1,3}[0-9$,. ]+$";

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
	({ locale = "pt-BR", currency = "BRL", adjustCaret, ...html }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		const [input, setInput] = useState<string>(() => `${html.value || ""}`);

		const formatter = useCallback(
			(n: string) => {
				const realValue = currencyToFloat(n);
				return new Intl.NumberFormat(locale, { style: "currency", currency }).format(realValue);
			},
			[locale, currency]
		);

		useLayoutEffect(() => {
			const money = formatter(`${html.value || ""}`);
			setInput(money);
		}, [html.value, formatter]);

		useImperativeHandle(externalRef, () => ref.current!);

		const change = (e: React.ChangeEvent<HTMLInputElement>) => {
			e.persist();
			const money = formatter(e.target.value);
			const realValue = currencyToFloat(money);
			const cursor = e.target.selectionStart ?? 0;
			ref.current!.value = money;
			setInput(money);
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
