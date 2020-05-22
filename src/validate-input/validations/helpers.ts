const ONLY_NUMBERS = /[^\d]/g;

export const onlyNumber = (n = "") => n.replace(ONLY_NUMBERS, "");
