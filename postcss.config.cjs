/** @type {import('postcss-load-config').Config} */
const config = ctx => ({
	...ctx.options,
	plugins: [
		require('autoprefixer'),
		require('postcss-import'),
		require('postcss-nested'),
		require('cssnano'),
	],
});

module.exports = config;
