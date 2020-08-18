export const isValidBrDate = (s = "") => {
	const [day, month, year] = s.split("/").map((x) => Number.parseInt(x, 10));
	const date = new Date(year, month, day);
	return (date as any) !== "Invalid Date";
};
