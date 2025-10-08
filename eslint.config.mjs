import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "**/dist",
    "**/node_modules",
    "**/coverage",
    "**/babel.config.js",
    "**/example",
]), {
    extends: compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ),

    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
    },

    settings: {
        react: {
            version: "detect",
        },
    },
}, {
    files: ["config/**/*"],
    extends: compat.extends("eslint:recommended"),
}]);