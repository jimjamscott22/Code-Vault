/** @type {import('tailwindcss').Config} */

// Map a CSS-variable ramp to Tailwind colour shades. Each var holds "R G B"
// channels so opacity modifiers (e.g. `bg-zinc-800/5`) keep working. Flipping
// the variables under `.light` (see index.css) recolours the whole app with no
// markup changes.
const ramp = (name, shades) =>
  Object.fromEntries(
    shades.map((s) => [s, `rgb(var(--${name}-${s}) / <alpha-value>)`]),
  );

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zinc: ramp("zinc", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        emerald: ramp("emerald", [200, 300, 400, 500, 600, 700, 800, 900]),
        red: ramp("red", [200, 300, 400, 700, 800, 900]),
      },
      fontFamily: {
        mono: ["Monaspace Neon", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        display: ["Fraunces Variable", "Fraunces", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
}
