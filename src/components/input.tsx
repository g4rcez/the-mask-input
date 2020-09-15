import React, { useImperativeHandle, useMemo, useRef } from "react";
import { CustomInputProps, MaskConfig } from "../@types/input";
import { MaskInput } from "../core/react-mask";
import { convertMask, maskConfig } from "../helpers/masks";
import { CurrencyInput } from "./currency-input";

export const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
	({ mask, adjustCaret, guide: guidePlaceholder, value = "", ...html }, externalRef) => {
		const ref = useRef<HTMLInputElement>(null);
		useImperativeHandle(externalRef, () => ref.current!);

		const maskProps = useMemo(() => {
			if (!(mask && typeof mask === "string" && mask in maskConfig)) {
				return null;
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
			[value]
		);

		if (mask === "currency") {
			return <CurrencyInput {...html} value={value} ref={ref} />;
		}
		if (maskProps === null) {
			return <input {...html} value={value} ref={ref} />;
		}

		const { mask: m, ...other } = maskProps;
		const onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			html.onClick?.(event);
			if (adjustCaret) {
				ref.current?.setSelectionRange?.(0, 0);
			}
		};
		return (
			<MaskInput {...html} {...other} onClick={onClick} guide={guide} mask={maskProps.mask} placeholder={placeholder} ref={ref} value={value} />
		);
	}
);
