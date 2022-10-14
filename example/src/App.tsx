import "./App.css";
import {
	Cellphone,
	CellTelephone,
	Cep,
	Cnpj,
	Color,
	Cpf,
	CpfCnpj,
	CreditCard,
	CurrencyInput,
	Date,
	Int,
	IsoDate,
	Telephone,
	Time,
	Uuid
} from "../../src";

export default function App() {
	return (
		<section style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
			<CurrencyInput autoFocus placeholder="Money" />
			<Cpf placeholder="CPF" />
			<CellTelephone placeholder="CellTelephone" />
			<Cellphone placeholder="Cellphone" />
			<Cep placeholder="Cep" />
			<Cnpj placeholder="Cnpj" />
			<Color placeholder="Color" />
			<Cpf placeholder="Cpf" />
			<CpfCnpj placeholder="CpfCnpj" />
			<CreditCard placeholder="CreditCard" />
			<Date placeholder="Date" />
			<Int placeholder="Int" />
			<IsoDate placeholder="IsoDate" />
			<Telephone placeholder="Telephone" />
			<Time placeholder="Time" />
			<Uuid placeholder="Uuid" />
		</section>
	);
}
