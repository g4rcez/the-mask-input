const COLOR = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})/g;

export const isValidColor = (s = "") => COLOR.test(s);
