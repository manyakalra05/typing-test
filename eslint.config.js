import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);

<!-- 2025-03-29T11:13:49+05:30 -->
<!-- 2025-05-09T07:04:01+05:30 -->
<!-- 2025-10-07T22:59:25+05:30 -->
<!-- Update 2024-11-05T13:04:28+05:30 -->
<!-- Update 2024-11-16T18:01:10+05:30 -->
<!-- Update 2024-11-26T07:44:18+05:30 -->
<!-- Update 2025-03-14T08:14:36+05:30 -->
<!-- Update 2025-04-15T06:25:43+05:30 -->
<!-- Update 2025-06-14T09:18:58+05:30 -->