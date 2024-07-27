import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';
// eslint-disable-next-line import-x/no-unresolved
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	{ ignores: ['**/dist/', '**/node_modules/'] },
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...compat.extends('plugin:import-x/errors'),
	...compat.extends('plugin:import-x/warnings'),
	...compat.extends('plugin:import-x/typescript'),
];
