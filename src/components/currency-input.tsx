import React, { useImperativeHandle, useMemo, useRef, useState } from "react";
import { currencyToFloat, namedFormatCurrency, safeConvert, toCurrency } from "../helpers/fmt";
import { CurrencyInputProps } from "../@types/input";

const PATTERN = "^[A-Z]{1,3}[0-9$,. ]+$";

export const CurrencyInput: React.FC<CurrencyInputProps> = React.forwardRef<any, CurrencyInputProps>(
	({ locale = "pt-BR", currency = "BRL", ...props }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		useImperativeHandle(externalRef, () => ref.current);

		const info = useMemo(() => {
			const infos = namedFormatCurrency(locale, currency);
			infos.currency = `${infos.currency.trim()} `;
			infos.literal = infos.literal.trim() || ".";
			return infos;
		}, [locale, currency]);

		const [value, setValue] = useState(() =>
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
		return <input {...props} type="text" ref={ref} value={value} onChange={change} inputMode="decimal" pattern={PATTERN} />;
	}
) as any;
