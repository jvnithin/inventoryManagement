/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',         // your main brand green
        secondary: '#065F46',       // darker green for headers/icons
        accent: '#22C55E',          // lighter accent green
        danger: '#DC2626',          // red for destructive actions
        muted: '#6B7280',           // neutral gray
        background: {
          light: '#F8FAFC',         // overall screen background
          dark: '#1F2937',          // dark mode background
        },
        info: '#06B6D4',            // teal for map FAB or info
        warning: '#D97706',         // amber for pending badges
      },
    },
  },
  plugins: [],
}
