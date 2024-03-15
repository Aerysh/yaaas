module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": "warn", // Warn about console.log statements
    "no-debugger": "error", // Prevent debugger statements
    "no-var": "error", // Require let or const instead of var
    "prefer-const": "error", // Prefer const over let
    "no-unused-vars": "warn", // Warn about unused variables
    "import/no-unresolved": "error", // Ensure imports point to a file/module that can be resolved
    "import/named": "error", // Ensure named imports correspond to a named export in the remote file
    "import/namespace": "error", // Ensure a default import is present, given a namespace import is used
    "import/default": "error", // Ensure a default export is present, given a default import is used
    "import/export": "error", // Report any invalid exports
  },
  plugins: ["import"],
};
