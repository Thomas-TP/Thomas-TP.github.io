/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        // Define a softer color palette
        primary: '#3b82f6',       // A more gentle blue
        secondary: '#fcd34d',     // A softer yellow
        accent: '#dc2626',        // A more muted red
        neutral: '#6b7280',       // A medium gray for text
        background: '#f5f5f5',    // A light gray for the background
        'primary-dark': '#2563eb',  // Darker shade of primary for hover/active states
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark"], // Enable both light and dark themes
  },
}
