# the-mask-input

A simple way to create inputs with masked values. Works like `<input />`, but apply mask for your values.

Just 2.8kB Minified + Gzipped - [Bundlephobia](https://bundlephobia.com/package/the-mask-input)

# How to Install?

```bash
npm i the-mask-input
yarn add the-mask-input
pnpm add the-mask-input
```

# How can I use?

[tl;dr examples](https://github.com/g4rcez/the-mask-input/blob/master/example/src/App.tsx)

the-mask-input already has some default presets of mask, like cpf/cnpj (brazillian documents) and uuid.

```typescript jsx
import {Input} from "the-mask-input"

export default function App () {
	return <form>
		<Input name="cpf" placeholder="cpf" mask="cpf" />
	</form>
}
```

This is a simple code to use mask in your inputs.

# Default masks

All built-in masks in `<Input />`

- cpf: 000.000.000-00
- cnpj: 00.000.000/0000-00
- cpfCnpj: 000.000.000-00 and 00.000.000/0000-00
- cep: 000000-000
- cellphone: (00) 90000-0000
- telephone: (00) 0000-0000
- cellTelephone: (00) 0000-0000 and (00) 90000-0000
- int: accept only integer numbers
- color: #000 and #000000
- creditCard: 0000 0000 0000 0000 0000
- date: dd/MM/yyyy - Default date is brazillian pattern
- isoDate: yyyy/MM/dd
- time: 00:00 - Accept only 0-23 in yours
- uuid: default [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier) format

# Create your own mask

If you need to create your own pattern, you can do
using [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) or strings
as [tokens](https://github.com/g4rcez/the-mask-input/blob/master/src/masks.ts#L3). To create your masks, you can use

- Only a string as tokens
- Array of strings or RegExp
- A function returning an array of strings or RegExp

## Using string

We can create a CPF mask only using string:

```typescript jsx
<Input mask="ddd.ddd.ddd-dd" />
```

`d` is a special token in the-mask-input, and has more:

- `d`: only numbers 0-9
- `H`: hexadecimals. 0-9 and a-f
- `X`: all numbers and strings A-Z (upper and lower case)
- `x`: only strings A-Z (upper and lower case)
- `A`: only strings A-Z, only upper case
- `a`: only strings A-Z, only lower case

## Using array

In this option, you can use string and RegExp. Here you cannot use the-mask-input tokens. Let's create
a [Vehicle registration plates of Brazil](https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Brazil)

```typescript jsx
<Input mask={[/[A-Z]/, /[A-Z]/, /[A-Z]/, /\d/, /\d/, /\d/, /\d/]} />
```

## Using function

In this mode, you can use a function to apply some logic before you return an array. Let's create a time mask, accept
only 23 in hours.

```typescript jsx
const hourStartsWithTwo = ["2", /[0-3]/, ":", /[0-5]/, /\d/];
const hour = [/[012]/, /\d/, ":", /[0-5]/, /[0-9]/];
const mask = (value: string) => {
	const n = numbers (value);
	const first = n[0];
	return first === "2" ? hourStartsWithTwo : hour;
}
<Input mask={mask} />
```
