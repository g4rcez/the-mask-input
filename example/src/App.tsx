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
} from "the-mask-input";
import { useState } from "react";

const Field = ({ Component, placeholder, ...props }: any) => (
	<fieldset style={{ position: "relative" }}>
		<Component {...props} style={{ marginTop: "2rem" }} id={placeholder} placeholder={placeholder} />
		<label htmlFor={placeholder} style={{ position: "absolute", top: 0, left: 10 }}>
			{placeholder}
		</label>
	</fieldset>
);

export default function App() {
	const [state, setState] = useState(0);
	return (
		<form
			style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}
			onSubmit={(e) => {
				e.preventDefault();
				alert("Everything works");
			}}
		>
			<Field value={state} Component={CurrencyInput} placeholder="Currency - Controlled" onChange={(e: any) => setState(e.target.value)} />
			<Field Component={CurrencyInput} autoFocus placeholder="Money - Uncontrolled" />
			<Field Component={Cpf} placeholder="CPF" />
			<Field Component={CellTelephone} placeholder="CellTelephone" />
			<Field Component={Cellphone} placeholder="Cellphone" />
			<Field Component={Cep} placeholder="Cep" />
			<Field Component={Cnpj} placeholder="Cnpj" />
			<Field Component={Color} placeholder="Color" />
			<Field Component={Cpf} placeholder="Cpf" />
			<Field Component={CpfCnpj} placeholder="CpfCnpj" />
			<Field Component={CreditCard} placeholder="CreditCard" />
			<Field Component={Date} placeholder="Date" />
			<Field Component={Int} placeholder="Int" />
			<Field Component={IsoDate} placeholder="IsoDate" />
			<Field Component={Telephone} placeholder="Telephone" />
			<Field Component={Time} placeholder="Time" />
			<Field Component={Uuid} placeholder="Uuid" />
			<button type="submit" style={{ height: "fit-content", padding: "0.6rem" }}>
				Test pattern
			</button>
		</form>
	);
}
