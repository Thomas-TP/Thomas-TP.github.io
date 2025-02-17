/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',       // Indigo
        secondary: '#f59e0b',     // Ambre
        accent: '#dc2626',        // Rouge
        neutral: '#4a5568',       // Gris foncé
        background: '#f8fafc',    // Gris très clair
        'primary-dark': '#4f46e5',  // Version plus foncée du primaire
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // Une police sans-serif moderne
        'serif': ['Merriweather', 'serif'],
      },
      container: {  //Ajout de la configuration container
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
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
