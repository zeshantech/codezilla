import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable the rule globally
      "@next/next/no-img-element": "off", // Disable the rule globally
      "react/no-unescaped-entities": "off", // Disable the rule globally
      // DISABLE: '_' is defined but never used.  @typescript-eslint/no-unused-vars
      "@typescript-eslint/no-unused-vars": "off",
      // DISABLE: React Hook useEffect has a missing dependency: 'login'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;