/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',    // Primary brand green
        secondary: '#065F46',  // Darker green
        accent: '#22C55E',     // Lighter accent green
        danger: '#DC2626',     // Destructive actions
        muted: '#6B7280',      // Neutral gray
        background: {
          light: '#F8FAFC',
          dark: '#1F2937',
        },
      },
    },
  },
  plugins: [],
}
