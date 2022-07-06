import React, { useImperativeHandle, useMemo, useRef } from "react";
import { CustomInputProps, MaskConfig } from "../@types/input";
import { MaskInput } from "../core/react-mask";
import { convertMask, maskConfig } from "../helpers/masks";
import { CurrencyInput } from "./currency-input";

const returnString = (s: string) => s;

export const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
	({ mask, onChange, adjustCaret, guide: guidePlaceholder = true, revertMask, ...html }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		useImperativeHandle(externalRef, () => ref.current!);

		const maskProps = useMemo(() => {
			if (mask === undefined || mask === "currency") {
				return null;
			}
			if (Array.isArray(mask) || typeof mask === "function") {
				return {
					mask,
					title: html.title,
					revert: returnString,
					pattern: html?.pattern,
					inputMode: html?.inputMode
				};
			}
			const config: MaskConfig = maskConfig[mask];
			return {
				...config,
				inputMode: config?.inputMode ?? html?.inputMode,
				pattern: config?.pattern ?? html?.pattern,
				title: config?.title ?? html?.title
			};
		}, [mask, html.inputMode, html.pattern, html.title, html.placeholder]);

		const guide = useMemo(() => guidePlaceholder || mask === "int", [html.placeholder, maskProps, mask, guidePlaceholder]);
		const placeholder = useMemo(
			() =>
				maskProps === null || maskProps.mask === undefined || mask === "int"
					? html.placeholder
					: html.placeholder ?? convertMask(maskProps.mask),
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

		if (maskProps === null || maskProps.mask === undefined) {
			return <input {...html} onChange={onChange} ref={ref} />;
		}

		const { mask: m, revert, ...other } = maskProps;
		const onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			html.onClick?.(event);
			ref.current?.select();
			if (adjustCaret) {
				ref.current?.setSelectionRange?.(0, 0);
			}
		};

		if (mask === "date") {
			return (
				<input
					{...html}
					{...other}
					maxLength={10}
					type="date"
					pattern="\d{4}-\d{2}-\d{2}"
					onClick={onClick}
					placeholder={placeholder}
					ref={ref}
					onChange={change}
				/>
			);
		}

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
