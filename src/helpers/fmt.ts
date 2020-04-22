import { Locales } from "../@types/locales";
import { CurrencyLocale } from "../@types/currency-locale";

export const fromValue = (value = "") =>
  value.replace(/(-(?!\d))|[^0-9|-]/g, "") || "";

const minLength = 3;

export const padding = (digits: string) => {
  const currentLength = digits.length;
  if (currentLength >= minLength) {
    return digits;
  }
  const amountToAdd = minLength - currentLength;
  return `${"0".repeat(amountToAdd)}${digits}`;
};

export const removeLeadingZeros = (num: string) =>
  num.replace(/^0+([0-9]+)/, "$1");

export type AddDecimals = {
  separator: string;
  decimalSeparator: string;
};

export const addDecimals = (
  num: string,
  { separator = ".", decimalSeparator = "," }: AddDecimals
) => {
  const centsStart = num.length - 2;
  const amount = removeLeadingZeros(num.substring(0, centsStart));
  const cents = num.substring(centsStart);
  return (
    amount.split(/(?=(?:\d{3})*$)/).join(separator) + decimalSeparator + cents
  );
};
export type ToCurrency = {
  separator: string;
  prefix: string;
  decimalSeparator: string;
};
export const toCurrency = (
  value: string,
  { separator, prefix, decimalSeparator }: ToCurrency
) => {
  const valueToMask = padding(fromValue(value));
  return `${prefix}${addDecimals(valueToMask, {
    separator,
    decimalSeparator,
  })}`;
};

export const safeConvert = (str: string | number = "", props: ToCurrency) =>
  toCurrency(Number.parseFloat(`${str}`).toFixed(2), props);

export const namedFormatCurrency = (
  locale: Locales,
  currency: CurrencyLocale
) =>
  new Intl.NumberFormat(locale, { style: "currency", currency })
    .formatToParts(0)
    .reduce((acc, el) => ({ ...acc, [el.type]: el.value }), {
      currency: "",
      literal: "",
      integer: "",
      decimal: "",
      fraction: "",
    });

export const formatBrlToFloat = (currency: string) => {
  const final = currency
    .replace(/,/g, ".")
    .replace(/(.*)\./, (x) => x.replace(/\./g, "") + ".")
    .replace(/[^0-9.]/g, "");
  return Number.parseFloat(final);
};

export const ToInt = (str: string) => Number.parseInt(str);

export const OnlyNumbers = (str: string) => str.replace(/[^0-9]+/g, "");

export const FormatCpf = (str: string) =>
  OnlyNumbers(str).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

export const FormatCNPJ = (str = "") =>
  OnlyNumbers(str).replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
