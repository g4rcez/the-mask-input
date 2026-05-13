import { describe, expect, test } from "vitest";
import { createPatternRegexMask, createPattern } from "../src/masks";

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

	test("Should create credit card ", () => {
		const mask = [/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/];
		const pattern = createPatternRegexMask(mask, false);
		expect(pattern).toBe("\\d\\d\\d\\d \\d\\d\\d\\d \\d\\d\\d\\d \\d\\d\\d\\d");
	});
});

describe("stringPattern escaping via createPattern", () => {
	test("escapes dots in mask literal positions", () => {
		const pattern = createPattern("ddd.ddd", "", true);
		expect(pattern).toContain("\\.");
		expect(new RegExp(pattern).test("123.456")).toBe(true);
		expect(new RegExp(pattern).test("123X456")).toBe(false);
	});

	test("escapes opening parenthesis in mask literal positions", () => {
		const pattern = createPattern("(dd)", "", true);
		expect(pattern).toContain("\\(");
		expect(new RegExp(pattern).test("(12)")).toBe(true);
		expect(new RegExp(pattern).test("X12)")).toBe(false);
	});

	test("escapes closing parenthesis in mask literal positions", () => {
		const pattern = createPattern("(dd)", "", true);
		expect(pattern).toContain("\\)");
		expect(new RegExp(pattern).test("(12)")).toBe(true);
		expect(new RegExp(pattern).test("(12X")).toBe(false);
	});

	test("passes unescaped literal characters through unchanged", () => {
		const pattern = createPattern("dd-dd", "", true);
		expect(pattern).toContain("-");
		expect(new RegExp(pattern).test("12-34")).toBe(true);
	});
});
