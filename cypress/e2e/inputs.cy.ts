describe("Test all masked inputs", () => {
	before(() => {
		cy.visit("http://localhost:5173");
	});

	const test = (id: string, type: string, value: string) =>
		cy.get(`input[name='${id}']`).focus().clear().type(type, { force: true }).should("have.value", value);

	it("test percent", () => {
		test("percent", "0", "0,00 %");
		test("percent", "1", "0,01 %");
		test("percent", "10", "0,10 %");
		test("percent", "100", "1,00 %");
		test("percent", "1000", "10,00 %");
		test("percent", "10000", "100,00 %");
	});

	it("test cellTelephone using a telephone", () => {
		test("cellTelephone", "0012345678", "(00) 1234-5678");
	});

	it("test time HH:mm", () => {
		test("time", "1212", "12:12");
		test("time", "2999", "2");
		test("time", "29221", "22:21");
	});

	it("test uuid", () => {
		test("uuid", "c70c66517068450c8eccf7c6f9f1465c", "c70c6651-7068-450c-8ecc-f7c6f9f1465c");
	});

	it("test telephone", () => {
		test("telephone", "0012345678", "(00) 1234-5678");
	});

	it("test iso date pattern", () => {
		test("isoDate", "19701231", "1970-12-31");
	});

	it("test money input", () => {
		test("money", "25000", "R$ 250,00");
	});

	it("test cellphone", () => {
		test("cellphone", "0012345678", "(00) 91234-5678");
	});

	it("test int pattern", () => {
		test("int", "12345.00", "1234500");
	});

	it("test date in PT-BR pattern", () => {
		test("date", "31121970", "31/12/1970");
	});

	it("test creditCard", () => {
		test("creditCard", "0000000000000000", "0000 0000 0000 0000");
	});

	it("test color", () => {
		test("color", "fff000", "#fff000");
	});

	it("test cpf", () => {
		test("cpf", "00000000000", "000.000.000-00");
	});

	it("test cellTelephone using a cellphone", () => {
		test("cellTelephone", "111111111111", "(11) 91111-1111");
	});

	it("test cep", () => {
		test("cep", "12345000", "12345-000");
	});

	it("test cnpj", () => {
		test("cnpj", "00000000000000", "00.000.000/0000-00");
	});

	it("test cpfCnpj", () => {
		test("cpfCnpj", "11111111100", "111.111.111-00");
		test("cpfCnpj", "00000000000000", "00.000.000/0000-00");
	});

	it("Should submit without errors", () => {
		cy.get("button#submit").click().wait(1000);
		cy.get("#test").should("exist");
	});
});
