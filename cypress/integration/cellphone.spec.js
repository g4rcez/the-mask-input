/// <reference types="Cypress" />

describe("Test CPF", () => {
	it("CPF Field", () => {
		cy.visit("http://localhost:3000/")
			.get("input[name='cpf']")
			.click()
			.type("00000000000")
			.blur()
			.should("contain.value", "000.000.000-00");
	});
});
