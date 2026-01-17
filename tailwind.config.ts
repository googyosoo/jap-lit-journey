import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#d946ef", // Fuschia-500 equivalent for Sakura feel? Or maybe more subtle using HSL
                    foreground: "#ffffff",
                },
                sakura: {
                    100: "#fce7f3",
                    300: "#fbcfe8",
                    500: "#f472b6",
                    700: "#be185d",
                },
                indigo: {
                    900: "#312e81", // Traditional deep blue
                },
                paper: "#fdfbf7", // Warm off-white
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "sans-serif"],
                serif: ["var(--font-geist-mono)", "serif"], // Using geist mono as placeholder, will switch to proper serif
            },
        },
    },
    plugins: [],
};
export default config;
