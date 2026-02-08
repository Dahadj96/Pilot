import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#FFFFFF",
                surface: "#F8FAFC",
                pilot: {
                    blue: "#0052FF",
                    "blue-dark": "#0041CC",
                },
                text: {
                    primary: "#0F172A",
                    secondary: "#64748B",
                },
            },
            borderRadius: {
                "3xl": "24px",
            },
            boxShadow: {
                "pilot-sm": "0 2px 8px rgba(0, 0, 0, 0.04)",
                "pilot-md": "0 4px 16px rgba(0, 0, 0, 0.08)",
                "pilot-lg": "0 8px 32px rgba(0, 0, 0, 0.12)",
            },
            backdropBlur: {
                glass: "12px",
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;
