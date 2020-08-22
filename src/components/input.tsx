import React, { useCallback, useImperativeHandle, useMemo, useRef } from "react";
import MaskedInput from "react-text-mask";
import { CustomInputProps, MaskConfig } from "../@types/input";
import { convertMaskToString, maskConfig } from "../helpers/masks";
import { CurrencyInput } from "./currency-input";

export const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(({ mask, value = "", ...html }, externalRef) => {
	const ref = useRef<HTMLInputElement>(null);
	useImperativeHandle(externalRef, () => ref.current!);

	const maskProps = useMemo(() => {
		if (!(mask && typeof mask === "string" && mask in maskConfig)) {
			return null;
		}
		const config: MaskConfig = maskConfig[mask];
		return {
			...config,
			inputMode: html.inputMode ?? config.inputMode,
			pattern: html.pattern ?? config.pattern,
			title: html.title ?? config.title
		};
	}, [mask, html.inputMode, html.pattern, html.title, html.placeholder]);

	const placeholder = useMemo(
		() => (maskProps === null || mask === "int" ? html.placeholder : html.placeholder ?? convertMaskToString(maskProps.mask)),
		[value]
	);

	const guide = useMemo(() => mask === "int", [html.placeholder, maskProps, mask]);

	const masked = useMemo(() => (maskProps === null ? value : maskProps.convert(value)), [value, maskProps]);

	if (mask === "currency") {
		return <CurrencyInput {...html} value={value} ref={ref} />;
	}

	if (mask === undefined || maskProps === null) {
		return <input {...html} value={value} ref={ref} />;
	}
	const { convert, mask: m, ...other } = maskProps;
	const forward = useCallback((e: MaskedInput | null) => {
		(ref.current as any) = e?.inputElement;
	}, []);
	
	return <MaskedInput {...html} {...other} guide={guide} mask={maskProps.mask} placeholder={placeholder} ref={forward} value={masked} />;
});
