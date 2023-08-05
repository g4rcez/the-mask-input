import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input, TheMaskInputProps } from "../../src";

type Value = string | number;

const StyledInput = (props: TheMaskInputProps) => (
	<fieldset className="flex flex-col gap-2">
		<label className="text-slate-600 uppercase text-xs">{props.placeholder}</label>
		<Input {...props} required className="p-1 border border-slate-300 text-slate-600 antialiased rounded" />
	</fieldset>
);

export const Controlled = () => {
	const [value, setValue] = useState("");
	return (
		<fieldset className="p-4 border border-slate-400">
			{value}
			<StyledInput mask="cpf" value={value} onChangeText={(e) => setValue(e)} />
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
	const ref = useRef<HTMLFormElement>(null);
	useEffect(() => {
		if (ref.current === null) return;
		const observer = new MutationObserver(console.log);
		observer.observe(ref.current, {
			subtree: true,
			childList: true,
			attributeOldValue: true,
			characterData: true,
			attributes: true
		});
		console.log("observing");
		return () => {
			observer.disconnect();
		};
	}, []);
	return (
		<form ref={ref} className="flex gap-6 flex-wrap items-end" onSubmit={(e) => e.preventDefault()}>
			<StyledInput mask="percent" locale="pt-BR" name="default-percent" placeholder="percent" />
			<StyledInput mask="cellTelephone" name="default-cellTelephone" placeholder="cellTelephone" />
			<StyledInput mask="cellphone" name="default-cellphone" placeholder="cellphone" />
			<StyledInput defaultValue="00000000" mask="cep" name="default-cep" placeholder="cep" />
			<StyledInput defaultValue="00000111223456" mask="cnpj" name="default-cnpj" placeholder="cnpj" />
			<StyledInput mask="cpfCnpj" name="default-cpfCnpj" placeholder="cpfCnpj" />
			<StyledInput mask="color" name="default-color" placeholder="color" />
			<StyledInput defaultValue="02134567892" mask="cpf" name="default-cpf" placeholder="cpf" />
			<StyledInput mask="creditCard" name="default-creditCard" placeholder="creditCard" />
			<StyledInput mask="date" name="default-date" placeholder="date" />
			<StyledInput mask="int" name="default-int" placeholder="int" />
			<StyledInput mask="isoDate" name="default-isoDate" placeholder="isoDate" />
			<StyledInput mask="money" name="default-money" placeholder="money" />
			<StyledInput mask="telephone" name="default-telephone" placeholder="telephone" />
			<StyledInput mask="time" name="default-time" placeholder="time" />
			<StyledInput mask="uuid" name="default-uuid" placeholder="uuid" />
			<StyledInput mask={[/\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]} name="default-expiresIn" placeholder="expiresIn" />
			<button className="px-4 py-1 bg-blue-500 text-white rounded-lg h-fit" type="submit">
				Test masks
			</button>
		</form>
	);
};

export default function App() {
	const [state, setState] = useState({ int: 1000, CurrencySymbol: 500 } as Record<string, Value>);
	const [show, setShow] = useState(false);
	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setState((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="p-8 flex flex-wrap gap-8">
			<Controlled />
			<InputsWithDefault />
			{show && <span id="test">Success</span>}
			<form
				className="flex gap-6 flex-wrap items-end"
				onSubmit={(e) => {
					e.preventDefault();
					setShow(true);
				}}
			>
				<StyledInput value={state.int} onChange={onChange} mask="int" name="int" type="number" placeholder="Integer" />
				<StyledInput value={state.percent} onChange={onChange} mask="percent" name="percent" placeholder="percent" />
				<StyledInput value={state.cellTelephone} onChange={onChange} mask="cellTelephone" name="cellTelephone" placeholder="cellTelephone" />
				<StyledInput value={state.cellphone} onChange={onChange} mask="cellphone" name="cellphone" placeholder="cellphone" />
				<StyledInput value={state.cep} onChange={onChange} mask="cep" name="cep" placeholder="cep" />
				<StyledInput value={state.cnpj} onChange={onChange} mask="cnpj" name="cnpj" placeholder="cnpj" />
				<StyledInput value={state.cpfCnpj} onChange={onChange} mask="cpfCnpj" name="cpfCnpj" placeholder="cpfCnpj" />
				<StyledInput value={state.color} onChange={onChange} mask="color" name="color" placeholder="color" />
				<StyledInput value={state.cpf} onChange={onChange} mask="cpf" name="cpf" placeholder="cpf" />
				<StyledInput value={state.creditCard} onChange={onChange} mask="creditCard" name="creditCard" placeholder="creditCard" />
				<StyledInput value={state.date} onChange={onChange} mask="date" name="date" placeholder="date" />
				<StyledInput value={state.isoDate} onChange={onChange} mask="isoDate" name="isoDate" placeholder="isoDate" />
				<StyledInput value={state.money} onChange={onChange} mask="money" name="money" placeholder="Money - asNumber" />
				<StyledInput
					value={state.CurrencySymbol}
					onChange={onChange}
					name="Currency"
					placeholder="Currency - Symbol"
					mask="currency"
					currency="USD"
					locale="en-US"
				/>
				<StyledInput
					value={state.CurrencyCode}
					onChange={onChange}
					name="CurrencyCode"
					placeholder="Currency - Code"
					mask="currency"
					currency="USD"
					currencyDisplay="code"
					locale="en-US"
				/>
				<StyledInput value={state.CurrencyCode} onChange={onChange} name="CurrencyCode" placeholder="Currency - Code" mask="currency" />
				<StyledInput value={state.telephone} onChange={onChange} mask="telephone" name="telephone" placeholder="telephone" />
				<StyledInput value={state.time} onChange={onChange} mask="time" name="time" placeholder="time" />
				<StyledInput value={state.uuid} onChange={onChange} mask="uuid" name="uuid" placeholder="uuid" />
				<StyledInput
					value={state.expiresIn}
					onChange={onChange}
					mask={[/\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
					name="expiresIn"
					placeholder="expiresIn"
				/>
				<Input />
				<button id="submit" className="px-4 py-1 bg-blue-500 text-white rounded-lg h-fit" type="submit">
					Test pattern
				</button>
			</form>
		</div>
	);
}
