import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  tseslint.configs.recommended,
  {
    ignores: ["node_modules/", "dist/", "build/"],
    files: ["**/*.{js,mjs,cjs,ts}"],

    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
    },
    plugins: {
      prettier: prettierPlugin,
    },
    extends: [js.configs.recommended],
    rules: {
      "spaced-comment": "off",
      "consistent-return": "off",
      "func-names": "off",
      "object-shorthand": "off",
      "no-process-exit": "off",
      "no-process-env": "error",
      "no-param-reassign": "off",
      "no-return-await": "off",
      "no-underscore-dangle": "off",
      "class-methods-use-this": "off",
      "prefer-destructuring": ["warn", { object: true, array: false }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "req|res|next|val" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-relative-import-paths/no-relative-import-paths": "error",
    },
  },
]);
