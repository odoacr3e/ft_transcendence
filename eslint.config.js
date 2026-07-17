import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    plugins: { "better-tailwindcss": betterTailwindcss },
    rules: {
      "better-tailwindcss/no-unregistered-classes": ["warn", {
        // classi custom definite negli <style scoped> dei componenti
        ignore: ["action", "column", "on", "off"],
      }],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/views/StyleGame.css",
      },
    },
  },
]);
