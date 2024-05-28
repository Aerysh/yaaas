import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImportX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      'import-x': eslintPluginImportX,
    },
  },
  {
    rules: {
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
    },
  },
];
