import React, { useEffect } from "react";
import { Input } from "../components/input";
import { ValidateInputType, validations } from "./validations";

export const ValidateInput: React.FC<ValidateInputType> = ({ validate, onValidate, ...props }) => {
	useEffect(() => {
		if (props.value && validate && onValidate) {
			const fn = typeof validate === "function" ? validate : validations[validate];
			const test = fn(props.value || "");
			onValidate(test);
		}
	}, [props.value, onValidate, validate]);
	return <Input {...props} />;
};
