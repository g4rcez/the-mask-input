import { describe, expect, test } from "vitest";
import { inputMaskedProps } from "../src/masks";

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

	success("cnpj", "Should test CNPJ", "11.123.456/0001-89");
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
