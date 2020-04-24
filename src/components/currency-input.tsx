import React, { useImperativeHandle, useMemo, useRef, useState } from "react";
import { CurrencyCode } from "../@types/currency-code";
import { InputProps } from "../@types/input";
import { Locales } from "../@types/locales";
import { currencyToFloat, namedFormatCurrency, safeConvert, toCurrency } from "../helpers/fmt";

export type CurrencyInputProps = Omit<InputProps, "value"> & {
	locale?: Locales;
	currency?: CurrencyCode;
	ref: React.RefObject<HTMLInputElement>;
	value?: string | number;
};

export const CurrencyInput = React.forwardRef<any, CurrencyInputProps>(({ locale = "pt-BR", currency = "BRL", name, ...props }, externalRef) => {
	const ref = useRef<HTMLInputElement>(null);
	useImperativeHandle(externalRef, () => ref.current);

	const info = useMemo(() => {
		const infos = namedFormatCurrency(locale, currency);
		infos.currency = `${infos.currency.trim()} `;
		infos.literal = infos.literal.trim() || ".";
		return infos;
	}, [locale, currency]);

	const [value, setValue] = useState(
		safeConvert(props.value || "", {
			separator: info.literal,
			decimalSeparator: info.decimal,
			prefix: info.currency,
			decimalsLength: info.fraction.length
		})
	);

	const change = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.persist();
		const money = toCurrency(e.target.value, {
			separator: info.literal,
			decimalSeparator: info.decimal,
			prefix: info.currency,
			decimalsLength: info.fraction.length
		});
		const realValue = currencyToFloat(money);
		const cursor = e.target.selectionStart || 0;
		const currentGreaterThanPrevious = money.length < value.length;
		setValue(money);
		ref.current!.value = money;
		if (props.onChange) {
			props.onChange({
				...e,
				target: {
					...e.target,
					name: name || "",
					value: money
				}
			});
		}
		if (currentGreaterThanPrevious) {
			money.length;
		} else if (realValue !== 0) {
			ref.current!.selectionEnd = cursor;
		}
	};

	return (
		<input {...props} type="text" ref={ref} value={value} name={name} onChange={change} inputMode="decimal" pattern="^[A-Z]{1,3}[0-9$,. ]+$" />
	);
});
