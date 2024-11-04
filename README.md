# the-mask-input

A simple, lightweight library for creating inputs with masked values. The `the-mask-input` library offers a familiar
`<input />` experience but with automatic masking for common input formats.

**Small bundle**: Just 3.9kB Minified + Gzipped - [Bundlephobia](https://bundlephobia.com/package/the-mask-input)

## Installation

Install via npm, yarn, or pnpm:

```bash
npm install the-mask-input
yarn add the-mask-input
pnpm add the-mask-input
```

## Usage

Quick [examples](https://github.com/g4rcez/the-mask-input/blob/master/example/src/App.tsx) are available in the repo.

The library includes default masks for Brazilian documents like CPF/CNPJ, UUIDs, and more.

```typescript jsx
import { Input } from "the-mask-input";

export default function App() {
	return (
		<form>
			<Input name="cpf" placeholder="CPF" mask="cpf"/>
		</form>
	);
}
```

### Built-in Masks

The following masks are available out-of-the-box in `<Input />`:

- **cpf**: 000.000.000-00
- **cnpj**: 00.000.000/0000-00
- **cpfCnpj**: Either CPF or CNPJ
- **cep**: 000000-000
- **cellphone**: (00) 90000-0000
- **telephone**: (00) 0000-0000
- **cellTelephone**: Supports both telephone and cellphone formats
- **int**: Accepts only integers
- **color**: #000 or #000000
- **creditCard**: 0000 0000 0000 0000 0000
- **date**: dd/MM/yyyy (Brazilian format by default)
- **isoDate**: yyyy/MM/dd
- **time**: 00:00 (24-hour format)
- **uuid**: Universally unique identifier format

For currency or percentage formats, simply use `"currency"` or `"percent"` as the mask.

#### Currency

This mask format allows you to use `locale` and `currency` to customize the way to format currency values

- [CurrencyCode](https://github.com/g4rcez/the-mask-input/blob/master/src/types.ts#L118)
- [Locales](https://github.com/g4rcez/the-mask-input/blob/master/src/types.ts#L300)

The formatter extracts monetary parts using
the [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).
And you have all possible values for `locale` and `currency`.

#### Percent

The percent mask follow the same rules of currency, but only accept `locale`.

## Custom Masks

To create custom masks, use [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
patterns or custom tokens. Here’s how:

### Using Tokens

The following tokens are available for defining mask patterns:

- **d**: digits (0-9)
- **H**: hexadecimals (0-9, a-f)
- **X**: alphanumeric (A-Z, upper/lower case)
- **x**: alphabetical (A-Z, upper/lower case)
- **A**: uppercase alphabet (A-Z)
- **a**: lowercase alphabet (a-z)

Example:

```typescript jsx
<Input mask="ddd.ddd.ddd-dd"/>
```

### Using RegExp Arrays

Use an array of strings or regular expressions to define a custom format.

Example: Brazilian license plate format (ABC-1234):

```typescript jsx
<Input mask={[/[A-Z]/, /[A-Z]/, /[A-Z]/, "-", /\d/, /\d/, /\d/, /\d/]}/>
```

### Using Function-Based Masks

For complex scenarios, use a function that returns an array based on specific conditions.

Example: A time input mask for hours (only allowing values up to 23):

```typescript jsx
const hourMask = (value: string) => {
	const startsWithTwo = ["2", /[0-3]/, ":", /[0-5]/, /\d/];
	const defaultHour = [/[01]/, /\d/, ":", /[0-5]/, /\d/];
	return value.startsWith("2") ? startsWithTwo : defaultHour;
};

<Input mask={hourMask}/>
```

## Contributing

Contributions are welcome! If you'd like to add a new feature or improve documentation, feel free to open a pull
request.

## License

This project is licensed under the MIT License.
