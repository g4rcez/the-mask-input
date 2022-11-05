describe("example to-do app", () => {
	beforeEach(() => {
		cy.visit("http://localhost:5173");
	});

	const test = (id: string, type: string, value: string) =>
		cy.get(`input[name='${id}']`).focus().clear().type(type, { force: true }).should("have.value", value);

	it("displays two todo items by default", () => {
		test("cep", "12345000", "12345-000");
		test("cnpj", "00000000000000", "00.000.000/0000-00");
		test("cpf", "00000000000", "000.000.000-00");
		test("color", "fff000", "#fff000");
		test("creditCard", "0000000000000000", "0000 0000 0000 0000");
		test("date", "31121970", "31/12/1970");
		test("int", "12345.00", "1234500");
		test("isoDate", "19701231", "1970-12-31");
		test("money", "25000", "R$ 250,00");
		test("telephone", "0012345678", "(00) 1234-5678");
		test("time", "1212", "12:12");
		test("uuid", "c70c66517068450c8eccf7c6f9f1465c", "c70c6651-7068-450c-8ecc-f7c6f9f1465c");

		cy.get("button[type=submit]").click().wait(1000);
		cy.get("#test").should("exist");
	});
});
