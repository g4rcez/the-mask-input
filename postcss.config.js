module.exports = {
	plugins: [
		require("autoprefixer"),
		require("postcss-import"),
		require("postcss-nested"),
		require("cssnano")({
			preset: "default"
		})
	]
};
