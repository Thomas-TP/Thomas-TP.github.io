/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',      // Un bleu plus moderne
        secondary: '#facc15',    // Un jaune plus doux
        accent: '#e11d48',       // Un rouge pour les accents
        neutral: '#4b5563',      // Gris plus foncé
        background: '#f9fafb',   // Gris très clair pour l'arrière-plan
        'primary-dark': '#1e40af', // Version plus foncée de la couleur primaire
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'], // Utilisez Roboto comme police sans-serif
        'serif': ['Merriweather', 'serif'], // Utilisez Merriweather comme police serif
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
}
