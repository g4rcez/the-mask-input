# the-mask-input

**The mask input** é um `<input />` para React com máscaras pré definidas para formatos comuns em formulários brasileiros.
Não tem o formato que você quer? Só passar um `Array<string|RegExp>` ou uma função `(text: string) => Array<string|RegExp>`

## Instalação

Esse processo aqui todo mundo já tá acostumado

```bash
npm i the-mask-input #ou se você usa yarn...
yarn add the-mask-input
```

## Como utilizar?

```jsx
import Input, { Masks } from "the-mask-input";
import React, { useState, useCallback } from "react";

const Field = ({ mask, title }: { mask: Masks; title: string }) => {
	const [value, setValue] = useState("");
	const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);
	return (
		<div>
			<label>
				{title}:
				<Input style={{ width: "100%" }} mask={mask} onChange={onChange} value={value} />
			</label>
		</div>
	);
};

const App = () => (
	<>
		<Field mask="cpf" title="Informe seu CPF"/>
	</>
)
```

Por padrão, `the-input-mask` possui algumas máscaras pre-definidas:

```typescript
type Masks = "cellphone" | "cellTelephone" | "cep" | "cnpj" | "color" | "cpf" | "cpfCnpj" | "creditCard" | "currency" | "date" | "isoDate" | "pis" | "telephone";
```

Atenção especial para "cellTelephone" e "cpfCnpj" que são máscaras que mudam os valores conforme o usuário digita

- cellTelephone irá de `(00) 0000-0000` para `(00) 90000-0000` caso o usuário informe o nono dígito.
- cpfCnpj irá de `000.000.000-00` para `00.000.000/0000-00` caso o usuário informe 12 dígitos ou mais

Caso nenhuma dessas te atenda, não fique triste, basta criar sua própria máscara com um Array de string ou RegExp. Se for um valor
dinâmico, você pode passar uma função `(text: string) => Array<string|RegExp>` para criar sua máscara. Se liga só:

```jsx
import Input, { Masks, CustomInputProps } from "the-mask-input";
import React, { useState, useCallback } from "react";

// Máscara com um número + 3 letras
const customMask = [/\d/, /[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/];

const CustomInput: React.FC<CustomInputProps> = (props) => {
	const [value, setValue] = useState("");
	const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);
	return (
		<Input {...props} mask={customMask} onChange={onChange} value={value} />
	);
};
```

Você não precisa sacar tudo de regex pra criar sua máscara, vou passar uma colinha pra você:

- `/\d/`: Número: 0-9
- `/[0-9]/`: Número de 0 a 9, o número pós "-" será o máximo permitido
- `/[2-5]/`: Número de 0 a 9, como exemplo do mínimo permitido sendo 2 e do máximo permitido sendo 5
- `/[A-Z]/`: Letras de A até Z (maiúsculo), a letra após "-" será a maior permitida
- `/[A-F]/`: Letras de A até F (maiúsculo), como exemplo do máximo permitido sendo F
- `/[!#$%*&()=+-]/`: Alguns caracteres especiais, nesse caso, lembre-se de colocar o "-" por último para não criar um range de caracteres

## ToDo

- Criar testes
- Criar uma função para gerar máscaras e ajudar os amigos desenvolvedores que não gostam de regex
