const CEP = /^\d{5}-\d{3}$/;

export const isValidCep = (s = "") => CEP.test(s);
