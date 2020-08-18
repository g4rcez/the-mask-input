import React, { useEffect, useState } from "react";
import { Input } from "../components/input";
import { ValidateInputType, validations } from "./validations";

export const ValidateInput: React.FC<ValidateInputType> = ({ validate, onValidate, ...props }) => {
	const [check, setCheck] = useState<null | boolean>(null);
	useEffect(() => {
		if (props.value && validate && onValidate) {
			const fn = typeof validate === "function" ? validate : validations[validate];
			const test = fn?.(props.value || "");
			if (!check && test) {
				setCheck(true);
				onValidate();
			}
		}
	}, [props.value, onValidate, validate, check]);
	return <Input {...props} />;
};
