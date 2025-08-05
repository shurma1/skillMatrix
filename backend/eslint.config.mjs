import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
	// Base JavaScript recommended config
	js.configs.recommended,
	
	// TypeScript recommended configs
	...tseslint.configs.recommended,
	
	// Your custom configuration
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		languageOptions: {
			parser: tseslint.parser,
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021
			},
			ecmaVersion: 2021,
			sourceType: "module",
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin
		},
		rules: {
			indent: ["error", "tab"],
			"@/indent": ["error", "tab"],
			"no-mixed-spaces-and-tabs": "error",
		},
	},
];
