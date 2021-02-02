import React, { useEffect, useImperativeHandle, useRef } from "react";
import { createInputMaskElement } from "./create-input-mask-element";
import { isNil } from "../helpers/utilities";

type Props = {
	guide?: boolean;
	pipe?: any;
	mask: Function | Array<string | RegExp>;
	placeholderChar?: string;
	showMask?: boolean;
	keepCharPositions?: boolean;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const MaskInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
	const textMaskInputElement = useRef<any>(null);
	const inputElement = useRef<HTMLInputElement>(null);
	useImperativeHandle(ref, () => inputElement.current!);

	const initTextMask = () => {
		const value = props.value;
		const element = createInputMaskElement({
			inputElement: inputElement.current!,
			guide: !!props.guide,
			...props
		});
		textMaskInputElement.current = element;
		textMaskInputElement.current.update(value);
	};

	useEffect(initTextMask, []);

	useEffect(() => {
		const { value, pipe, mask, guide, placeholderChar, showMask } = props;
		const settings = { guide, placeholderChar, showMask };
		const isPipeChanged =
			typeof pipe === "function" && typeof props.pipe === "function"
				? pipe.toString() !== props.pipe.toString()
				: (isNil(pipe) && !isNil(props.pipe)) || (!isNil(pipe) && isNil(props.pipe));
		const isMaskChanged = mask.toString() !== props.mask.toString();
		const isSettingChanged = Object.keys(settings).some((prop) => settings[prop] !== props[prop]) || isMaskChanged || isPipeChanged;

		const isValueChanged = value !== inputElement.current?.value;

		if (isValueChanged || isSettingChanged) {
			initTextMask();
		}
	}, [props.value, props.mask, props.guide, props.showMask]);

	const { mask, guide, pipe, placeholderChar, keepCharPositions, onChange, showMask, ...htmlProps } = props;

	const onChangeInput = (event: any) => {
		textMaskInputElement.current.update();
		onChange?.(event);
	};
	return <input {...htmlProps} onChange={onChangeInput} ref={inputElement} />;
});
