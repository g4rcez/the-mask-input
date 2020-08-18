import React, { useImperativeHandle, useMemo, useRef } from "react";
import MaskedInput from "react-text-mask";
import { CustomInputProps, MaskConfig, MaskType } from "../@types/input";
import { convertMaskToString, maskConfig } from "../helpers/masks";
import { CurrencyInput } from "./currency-input";

export const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(({ mask, value = "", ...html }, externalRef) => {
	const internalRef = useRef<HTMLInputElement>(null);
	useImperativeHandle(externalRef, () => internalRef.current!);

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

	const maskedValue = useMemo(() => (maskProps === null ? value : maskProps.convert(value)), [value, maskProps]);

	if (mask === "currency") {
		return <CurrencyInput {...html} value={value} ref={internalRef} />;
	}

	if (mask === undefined || maskProps === null) {
		return <input {...html} value={value} ref={internalRef} />;
	}

	if (maskProps !== null) {
		const { convert, ...other } = maskProps;
		return (
			<MaskedInput
				{...html}
				{...other}
				guide={guide}
				mask={maskProps.mask}
				placeholder={placeholder}
				ref={internalRef as any}
				value={maskedValue}
			/>
		);
	}
	return <MaskedInput guide={guide} {...html} placeholder={placeholder} value={value} mask={mask as MaskType} ref={internalRef as any} />;
});
