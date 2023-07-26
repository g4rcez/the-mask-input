import { describe, expect, test } from "vitest";
import { createPatternRegexMask } from "../src/masks";

describe("Should create HTML pattern", () => {
	test("Should create random pattern using RegExp[]", () => {
		const mask = [/[A-Z]/, /[A-Z]/, /[A-Z]/, /[0-9]/, /[0-9]/];
		const pattern = createPatternRegexMask(mask, true);
		expect(pattern).toBe("^[A-Z][A-Z][A-Z][0-9][0-9]$");
	});

	// Because of '.' this pattern is very dangerous. To avoid problems, we have the function escape
	// and require '.' as literal, applying the regex escape \.
	test("Should create CPF mask", () => {
		const mask = [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/];
		const pattern = createPatternRegexMask(mask, true);
		expect(pattern).toBe("^\\d\\d\\d\\.\\d\\d\\d\\.\\d\\d\\d-\\d\\d$");
	});

	// Because of '.' this pattern is very dangerous. To avoid problems, we have the function escape
	// and require '.' as literal, applying the regex escape \.
	test("Should create CPF mask", () => {
		const mask = [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/];
		const pattern = createPatternRegexMask(mask, false);
		expect(pattern).toBe("\\d\\d\\d\\.\\d\\d\\d\\.\\d\\d\\d-\\d\\d");
	});
});
