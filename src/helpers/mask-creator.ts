const hexRegex = /[A-Fa-f0-9]/;

const specialRegex = /[@#$%*¨*(!)\\/=+§_<>,.?;-]/;

const alphaRegex = /[A-Za-z]/;

const decimalRegex = /\d/;

const binaryRegex = /[01]/;

const alphaNumericRegex = /[\S]/;

const TEMPLATE = {
  "#": decimalRegex,
  A: alphaRegex,
  a: alphaRegex,
  b: binaryRegex,
  B: binaryRegex,
  H: hexRegex,
  h: hexRegex,
  S: specialRegex,
  s: specialRegex,
  X: alphaNumericRegex,
};

export const maskCreator = (template = "") =>
  template
    .split("")
    .reduce(
      (acc, el) =>
        TEMPLATE.hasOwnProperty(el)
          ? acc.concat((TEMPLATE as any)[el])
          : acc.concat(el),
      [] as Array<string | RegExp>
    );
