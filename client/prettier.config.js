// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
  tailwindConfig: "./tailwind.config.js",
  tailwindFunctions: ["clsx"],
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
