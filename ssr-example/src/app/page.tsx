"use client";
import Input from "../../../src";

export default function Home() {
	return (
		<main className="bg-white text-black h-screen w-screen flex items-center justify-center">
			<Input className="bg-white border border-slate-400 text-black p-2 rounded-lg" mask="cpf" value="11122233344" />
		</main>
	);
}
