/// <reference types="Cypress" />

describe("Test CPF", () => {
	it("CPF Field", () => {
		cy.visit("http://localhost:3000/")
			.get("input[name='cnpj']")
			.click()
			.type("74587126000140")
			.blur()
			.should("contain.value", "74.587.126/0001-40");
	});
});
