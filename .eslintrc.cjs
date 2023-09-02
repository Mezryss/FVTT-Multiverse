module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier'],
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'prettier/prettier': 'error',
		indent: ['error', 'tab', { SwitchCase: 1 }],
		// no-undef is unfortunate, but it beats defining ESLint globals for everything in Foundry.
		'no-undef': 'off',
		'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
	},
};
