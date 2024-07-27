import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...compat.extends('plugin:import-x/recommended'),
	...compat.extends('plugin:import-x/typescript'),
];
