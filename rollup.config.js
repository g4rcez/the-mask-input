const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve").default
const strip = require("@rollup/plugin-strip");
const url = require("@rollup/plugin-url");
const external = require("rollup-plugin-peer-deps-external");
const { terser } = require("rollup-plugin-terser");
const fs = require("fs");
const typescript = require("rollup-plugin-typescript2");

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

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
		typescript({ clean: true }),
		commonjs({ sourceMap: false, ignoreGlobal: false })
	]
};
