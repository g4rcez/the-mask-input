import Input from "input";
import React, { useCallback, useEffect, useState } from "react";

const Field = ({ mask, title }: { mask: any; title: string }) => {
	const [v, vv] = useState("1250");

	const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => vv(e.target.value), []);

	useEffect(() => {
		setTimeout(() => vv("2222"), 5000);
	}, []);

	return (
		<div style={{ width: "30%", padding: "1rem" }}>
			<label>
				{title}:
				<Input
					adjustCaret
					placeholder=" "
					guide
					style={{ width: "100%" }}
					mask={mask as any}
					onChange={onChange}
					name={Math.random().toString()}
					value={v}
				/>
			</label>
		</div>
	);
};

function App() {
	const [a, setA] = useState("");
	return (
		<div>
			<div style={{ width: "30%", padding: "1rem" }}>
				<label>
					<Input
						adjustCaret
						placeholder="Custom Mask"
						guide
						style={{ width: "100%" }}
						mask={[/\d/, /\d/, "%"]}
						onChange={(e) => setA(e.target.value)}
						name={"custom"}
						value={a}
					/>
				</label>
			</div>
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
