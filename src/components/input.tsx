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
					revert: (s: string) => s,
					mask: mask,
					pattern: html.pattern,
					title: html.title,
					inputMode: html.inputMode
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

		if (mask === "currency") {
			return <CurrencyInput {...html} ref={ref} />;
		}
		if (maskProps === null) {
			return <input {...html} ref={ref} />;
		}

		const { mask: m, ...other } = maskProps;
		const onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			html.onClick?.(event);
			if (adjustCaret) {
				ref.current?.setSelectionRange?.(0, 0);
			}
		};

		const change = useMemo(
			() =>
				onChange
					? (e: React.ChangeEvent<HTMLInputElement>) => {
							if (m) {
								e.persist();
								const unmasked = maskProps.revert(e.target.value ?? "");
								onChange?.(e, unmasked);
							}
					  }
					: undefined,
			[onChange, maskProps]
		);

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
