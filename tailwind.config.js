/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                skeleton: "var(--skeleton)",
                border: "var(--btn-border)",
                input: "var(--input)",
            },
            borderRadius: {
                DEFAULT: "0.5rem",
            },
            boxShadow: {
                input: [
                    "0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
                    "0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
                    "0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
                ].join(", "),
            },
            animation: {
                "background-position-spin": "background-position-spin 3000ms infinite alternate",
                ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
                orbit: "orbit calc(var(--duration) * 1s) linear infinite",
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-in-up': 'fadeInUp 0.5s ease-out',
            },
            keyframes: {
                "background-position-spin": {
                    "0%": { backgroundPosition: "top center" },
                    "100%": { backgroundPosition: "bottom center" },
                },
                ripple: {
                    "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
                    "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
                },
                orbit: {
                    "0%": {
                        transform:
                            "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
                    },
                    "100%": {
                        transform:
                            "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
                    },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};