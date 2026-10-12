import { describe, expect, test } from "vitest";
import { inputMaskedProps, masks } from "../src";
import { createPattern } from "../src/masks";

const cpfCnpj = masks.cpfCnpj;
if (typeof cpfCnpj !== "function") throw new Error("Expected cpfCnpj to be a mask function");

describe("Should test regex", () => {
	const t = <T extends keyof typeof inputMaskedProps>(key: T, title: string, value: string, result: boolean) => {
		test(title, () => {
			const str = inputMaskedProps[key].pattern!;
			const r = new RegExp(str);
			expect(r.test(value)).toBe(result);
		});
	};

	const success = <T extends keyof typeof inputMaskedProps>(key: T, title: string, value: string) => t(key, `✅ ${title}`, value, true);

	const fail = <T extends keyof typeof inputMaskedProps>(key: T, title: string, value: string) => t(key, `🛑 ${title}`, value, false);

	success("cnpj", "Should test numeric CNPJ", "11.123.456/0001-89");
	success("cnpj", "Should test alphanumeric CNPJ with numeric check digits", "12.ABC.345/DE67-89");
	fail("cnpj", "Should reject letters in CNPJ check digits", "12.ABC.345/DE67-fG");

	test("✅ Should use the CNPJ mask for alphanumeric CPF/CNPJ values", () => {
		const value = "12.ABC.345/DE67-89";
		expect(cpfCnpj(value)).toBe("XX.XXX.XXX/XXXX-dd");
		expect(inputMaskedProps.cpfCnpj.transform?.(value)).toBe("12ABC345DE6789");
		expect(new RegExp(createPattern(cpfCnpj, value, true)).test(value)).toBe(true);
		expect(new RegExp(createPattern(cpfCnpj, "12.ABC.345/DE67-fG", true)).test("12.ABC.345/DE67-fG")).toBe(false);
	});

	test("✅ Should keep CPF/CNPJ numeric-only values as CPF", () => {
		expect(cpfCnpj("111.222.333-44")).toBe("ddd.ddd.ddd-dd");
	});
	success("cpf", "Should test CPF", "111.222.333-44");
	success("cep", "Should test CEP", "12345-000");
	success("telephone", "Should test Telephone (8 digits)", "(00) 2345-6780");
	success("cellphone", "Should test Cellphone (9 digits)", "(00) 92345-6780");
	success("uuid", "Should test UUID", "a5c127de-fa20-4042-8037-f3f309e4b8e4");
	success("color", "Should test Color using #rgb", "#f3f");
	success("color", "Should test Color using #rrggbb", "#f2ef09");

	fail("cellphone", "Should test Cellphone (9 digits)", "00 92345-6780");
	fail("cep", "Should test cep (9 digits)", "12345 000");
});
