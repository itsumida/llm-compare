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
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        destructive: "var(--destructive)",
        ring: "var(--ring)",
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        // Landing page
        "lp-bg": "var(--lp-bg)",
        "lp-surface": "var(--lp-surface)",
        "lp-border": "var(--lp-border)",
        "lp-text": "var(--lp-text)",
        "lp-text-secondary": "var(--lp-text-secondary)",
        "lp-text-muted": "var(--lp-text-muted)",
        "lp-text-dim": "var(--lp-text-dim)",
        "lp-accent": "var(--lp-accent)",
        "lp-green": "var(--lp-green)",
      },
      borderRadius: {
        m: "var(--radius-m)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
