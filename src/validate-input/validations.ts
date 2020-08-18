import { CustomInputProps, FixedMasks } from "../@types/input";
import { isValidCep } from "./validations/cep";
import { isValidCnpj } from "./validations/cnpj";
import { isValidColor } from "./validations/color";
import { isValidCpf } from "./validations/cpf";
import { isValidEmail } from "./validations/email";

type ValidateOptions = FixedMasks | "email";

export type ValidateInputType = CustomInputProps & {
	validate?: ValidateOptions | ((value: string) => boolean);
	onValidate?(): void;
	onErrorAfterValid?(): void;
};

type ValidateDict = Record<ValidateOptions, (str: string) => boolean>;

const placeholder = () => false;

export const validations: Partial<ValidateDict> = {
	int: placeholder,
	cellTelephone: placeholder,
	cellphone: placeholder,
	cep: isValidCep,
	cnpj: isValidCnpj,
	color: isValidColor,
	cpf: isValidCpf,
	cpfCnpj: placeholder,
	creditCard: placeholder,
	date: placeholder,
	email: isValidEmail,
	isoDate: placeholder,
	// pis: isValidPis,
	telephone: placeholder
};
