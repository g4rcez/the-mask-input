import Input from "input";
import React, { useState } from "react";

const Field = ({ mask, title }: { mask: any; title: string }) => {
	const [get, set] = useState("");
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => set(e.target.value);
	return (
		<div style={{ width: "30%", padding: "1rem" }}>
			<label>
				{title}:
				<Input
					placeholder=" "
					guide
					style={{ width: "100%" }}
					mask={mask as any}
					onChange={onChange}
					name={Math.random().toString()}
					value={get}
				/>
			</label>
			<button onClick={() => set((Math.random() * 1000000000).toString())}>Set</button>
		</div>
	);
};

function App() {
	const [a, setA] = useState("");
	return (
		<div>
			<input
				maxLength={10}
				type="text"
				onChange={(e) => {
					const maskDate = (value: string) => {
						let v = value.replace(/\D/g, "").slice(0, 10);
						if (v.length >= 5) {
							return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
						} else if (v.length >= 3) {
							return `${v.slice(0, 2)}/${v.slice(2)}`;
						}
						return v;
					};
					e.target.value = maskDate(e.target.value);
				}}
				placeholder="Date..."
			/>
			<Input placeholder="CPF no control" guide style={{ width: "100%" }} mask="cpf" name={"cpf-test"} />
			<Field mask="currency" title="Currency" />
			<div style={{ width: "30%", padding: "1rem" }}>
				<label>
					<Input
						placeholder="Custom Mask"
						guide
						style={{ width: "100%" }}
						mask={(str) => {
							const firstChar = Number.parseInt(str?.charAt(0) ?? "1");
							const second = firstChar === 2 ? /[0-4]/ : /\d/;
							return [/[012]/, second, ":", /[0-5]/, /\d/];
						}}
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
			<Field mask="cpf" title="CPF" />
			<Field mask="color" title="Color" />
			<Field mask="telephone" title="Telefone" />
			<Field mask="int" title="Integer" />
			<Field mask="percent" title="Percent" />
			<Field mask="date" title="Data - DD/MM/YYYY" />
			<Field mask="email" title="Email" />
			<Field mask="cpfCnpj" title="Document" />
			<Field mask="uuid" title="UUID V4" />
		</div>
	);
}

export default App;
