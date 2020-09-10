import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import strip from "@rollup/plugin-strip";
import url from "@rollup/plugin-url";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
	input: "src/index.tsx",
	output: [
		{
			file: pkg.main,
			format: "cjs",
			plugins: [terser()],
			exports: "named",
			sourcemap: false
		},
		{
			file: pkg.module,
			format: "es",
			exports: "named",
			sourcemap: false
		},
		{
			file: pkg.module,
			format: "esm",
			exports: "named",
			sourcemap: false
		}
	],
	external: ["react"],
	plugins: [
		strip(),
		external(),
		url(),
		resolve({ browser: true, preferBuiltins: false }),
		typescript({ rollupCommonJSResolveHack: true, clean: true }),
		commonjs({ sourceMap: false, ignoreGlobal: false })
	]
};
