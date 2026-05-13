import { describe, expect, test } from "vitest";
import { replaceBlankSpace } from "../src/libs";

describe("replaceBlankSpace", () => {
	test("replaces a non-breaking space with a regular space", () => {
		expect(replaceBlankSpace("R 1.234,56")).toBe("R 1.234,56");
	});
	test("replaces multiple non-breaking spaces", () => {
		expect(replaceBlankSpace("  ")).toBe("  ");
	});
	test("leaves regular spaces unchanged", () => {
		expect(replaceBlankSpace("hello world")).toBe("hello world");
	});
	test("returns empty string unchanged", () => {
		expect(replaceBlankSpace("")).toBe("");
	});
});
