/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f76f7',       // A slightly more vibrant blue
        'primary-700': '#355bbd',  // A darker shade of primary
        secondary: '#fdd835',     // A softer yellow
        accent: '#dc2626',        // A more muted red
        neutral: '#374151',       // A slightly darker gray for text
        background: '#ffffff',    // White background
        'primary-dark': '#2563eb',  // Darker shade of primary
      },
      fontFamily: {
        'sans': ['Nunito', 'sans-serif'],
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
    themes: ["light"], //On force le theme light
  },
}
