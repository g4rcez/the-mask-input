import Input, { Masks } from "input";
import React, { useCallback, useState } from "react";

const Field = ({ mask, title }: { mask: Masks; title: string }) => {
	const [v, vv] = useState("");

	const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => vv(e.target.value), []);

	return (
		<div style={{ width: "30%", padding: "1rem" }}>
			<label>
				{title}:
				<Input adjustCaret guide style={{ width: "100%" }} mask={mask} onChange={onChange} name={mask as string} value={v} />
			</label>
		</div>
	);
};

function App() {
	return (
		<div>
			<Field mask="cellphone" title="Celular" />
			<Field mask="cep" title="CEP" />
			<Field mask="creditCard" title="Cartão de crédito" />
			<Field mask="cep" title="CEP" />
			<Field mask="cnpj" title="CNPJ" />
			<Field mask="color" title="Color" />
			<Field mask="cpf" title="CPF" />
			<Field mask="currency" title="Currency" />
			<Field mask="telephone" title="Telefone" />
			<Field mask="int" title="Integer" />
			<Field mask="date" title="Data - DD/MM/YYYY" />
			<Field mask="email" title="Email" />
			<Field mask="cpfCnpj" title="Document" />
		</div>
	);
}

export default App;
