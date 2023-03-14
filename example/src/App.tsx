import "./App.css";
import { ChangeEvent, useState } from "react";
import { CurrencyInput, Input } from "../../src";

export const Controlled = () => {
	const [value, setValue] = useState("");
	return (
		<fieldset>
			{value}
			<Input mask="cpf" value={value} onChangeText={(e) => setValue(e)} />
			<button
				onClick={() =>
					setValue(
						Math.ceil(Math.random() * 9)
							.toString()
							.repeat(11)
					)
				}
			>
				Change
			</button>
		</fieldset>
	);
};

export const InputsWithDefault = () => {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
			<form style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }} onSubmit={(e) => e.preventDefault()}>
				<Input mask="percent" name="percent" placeholder="percent" />
				<Input mask="cellTelephone" name="cellTelephone" placeholder="cellTelephone" />
				<Input mask="cellphone" name="cellphone" placeholder="cellphone" />
				<Input defaultValue="00000000" mask="cep" name="cep" placeholder="cep" />
				<Input defaultValue="00000111223456" mask="cnpj" name="cnpj" placeholder="cnpj" />
				<Input mask="cpfCnpj" name="cpfCnpj" placeholder="cpfCnpj" />
				<Input mask="color" name="color" placeholder="color" />
				<Input defaultValue="02134567892" mask="cpf" name="cpf" placeholder="cpf" />
				<Input mask="creditCard" name="creditCard" placeholder="creditCard" />
				<Input mask="date" name="date" placeholder="date" />
				<Input mask="int" name="int" placeholder="int" />
				<Input mask="isoDate" name="isoDate" placeholder="isoDate" />
				<Input mask="money" name="money" placeholder="money" />
				<Input mask="telephone" name="telephone" placeholder="telephone" />
				<Input mask="time" name="time" placeholder="time" />
				<Input mask="uuid" name="uuid" placeholder="uuid" />
				<button type="submit" style={{ height: "fit-content", padding: "0.6rem" }}>
					Test masks
				</button>
			</form>
		</div>
	);
};

export default function App() {
	const [state, setState] = useState({} as Record<string, string>);
	const [show, setShow] = useState(false);
	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setState((prev) => ({ ...prev, [name]: value }));
	};
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
			<Controlled />
			<InputsWithDefault />
			{show && <span id="test">Success</span>}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setShow(true);
				}}
				style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}
			>
				<Input value={state.percent} onChange={onChange} mask="percent" name="percent" placeholder="percent" />
				<Input value={state.cellTelephone} onChange={onChange} mask="cellTelephone" name="cellTelephone" placeholder="cellTelephone" />
				<Input value={state.cellphone} onChange={onChange} mask="cellphone" name="cellphone" placeholder="cellphone" />
				<Input value={state.cep} onChange={onChange} mask="cep" name="cep" placeholder="cep" />
				<Input value={state.cnpj} onChange={onChange} mask="cnpj" name="cnpj" placeholder="cnpj" />
				<Input value={state.cpfCnpj} onChange={onChange} mask="cpfCnpj" name="cpfCnpj" placeholder="cpfCnpj" />
				<Input value={state.color} onChange={onChange} mask="color" name="color" placeholder="color" />
				<Input value={state.cpf} onChange={onChange} mask="cpf" name="cpf" placeholder="cpf" />
				<Input value={state.creditCard} onChange={onChange} mask="creditCard" name="creditCard" placeholder="creditCard" />
				<Input value={state.date} onChange={onChange} mask="date" name="date" placeholder="date" />
				<Input value={state.int} onChange={onChange} mask="int" name="int" placeholder="int" />
				<Input value={state.isoDate} onChange={onChange} mask="isoDate" name="isoDate" placeholder="isoDate" />
				<Input value={state.money} onChange={onChange} mask="money" name="money" placeholder="money" />
				<CurrencyInput value={state.money} onChange={onChange} name="Currency" placeholder="Currency" mask="currency" />
				<CurrencyInput value={state.money} onChange={onChange} name="Currency" placeholder="Currency" mask="currency" currency="USD" locale="en-US" />
				<CurrencyInput value={state.money} onChange={onChange} name="Currency" placeholder="Currency" mask="currency" currency="USD" currencyDisplay="code" locale="en-US" />
				<Input value={state.telephone} onChange={onChange} mask="telephone" name="telephone" placeholder="telephone" />
				<Input value={state.time} onChange={onChange} mask="time" name="time" placeholder="time" />
				<Input value={state.uuid} onChange={onChange} mask="uuid" name="uuid" placeholder="uuid" />
				<button type="submit" style={{ height: "fit-content", padding: "0.6rem" }}>
					Test pattern
				</button>
			</form>
		</div>
	);
}
