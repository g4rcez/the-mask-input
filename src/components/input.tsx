import React, { useImperativeHandle, useMemo, useRef } from "react";
import { CustomInputProps, MaskConfig } from "../@types/input";
import { MaskInput } from "../core/react-mask";
import { convertMask, maskConfig } from "../helpers/masks";
import { CurrencyInput } from "./currency-input";

export const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
	({ mask, onChange, adjustCaret, guide: guidePlaceholder, ...html }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		useImperativeHandle(externalRef, () => ref.current!);

		const maskProps = useMemo(() => {
			if (mask === undefined || mask === "currency") {
				return null;
			}
			if (Array.isArray(mask) || typeof mask === "function") {
				return {
					inputMode: html.inputMode,
					mask,
					pattern: html.pattern,
					revert: (s: string) => s,
					title: html.title,
				};
			}
			const config: MaskConfig = maskConfig[mask];
			return {
				...config,
				inputMode: config.inputMode,
				pattern: config.pattern,
				title: html.title ?? config.title
			};
		}, [mask, html.inputMode, html.pattern, html.title, html.placeholder]);

		const guide = useMemo(() => guidePlaceholder || mask === "int", [html.placeholder, maskProps, mask, guidePlaceholder]);
		const placeholder = useMemo(
			() => (maskProps === null || mask === "int" ? html.placeholder : html.placeholder ?? convertMask(maskProps.mask)),
			[html.value]
		);

		const change = useMemo(
			() =>
				onChange
					? (e: React.ChangeEvent<HTMLInputElement>) => {
							e.persist();
							if (m) {
								const unmasked = maskProps?.revert(e.target.value ?? "");
								return onChange?.(e, unmasked);
							}
							return onChange?.(e);
					  }
					: undefined,
			[onChange]
		);

		if (mask === "currency") {
			return <CurrencyInput {...html} onChange={onChange} ref={ref} />;
		}
		if (maskProps === null) {
			return <input {...html} onChange={onChange} ref={ref} />;
		}

		const { mask: m, ...other } = maskProps;
		const onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			html.onClick?.(event);
			if (adjustCaret) {
				ref.current?.setSelectionRange?.(0, 0);
			}
		};

		return (
			<MaskInput
				{...html}
				{...other}
				onClick={onClick}
				guide={guide}
				mask={maskProps.mask}
				placeholder={placeholder}
				ref={ref}
				onChange={change}
			/>
		);
	}
);
