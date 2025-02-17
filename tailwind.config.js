/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html', // Assurez-vous que votre fichier principal est inclus
    './src/**/*.{js,jsx,ts,tsx,vue}', // Incluez vos fichiers JavaScript/React/Vue si vous en avez
  ],
  darkMode: 'class', // Active le mode sombre basé sur une classe (par exemple, `<html class="dark">`)
  theme: {
    extend: {
      colors: {
        // Définissez vos couleurs personnalisées ici pour une palette cohérente
        primary: '#3490dc',   // Bleu principal
        secondary: '#ffed4a', // Jaune secondaire
        accent: '#f95643',    // Rouge accent
        neutral: '#6b7280',  // Gris neutre
        base: '#f3f4f6',     // Gris de base pour les arrière-plans
      },
      fontFamily: {
        // Définissez vos polices personnalisées ici
        sans: ['Inter var', 'sans-serif'], // Police sans serif par défaut (remplacez 'Inter var' par votre police préférée)
        serif: ['Merriweather', 'serif'],  // Police serif par défaut
      },
      spacing: {
        // Définissez des espacements personnalisés pour une cohérence accrue
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      // Ajoutez d'autres extensions de thème ici (animations, keyframes, etc.)
    },
  },
  plugins: [
    require('@tailwindcss/forms'),       // Ajoute des styles de base pour les formulaires
    require('@tailwindcss/typography'),  // Ajoute une belle typographie par défaut
    require('daisyui'),                  // Active DaisyUI (si vous l'utilisez)
    require('flowbite/plugin'), // Active Flowbite (si vous l'utilisez)
    // Ajoutez d'autres plugins ici si nécessaire (mais soyez parcimonieux)
  ],
  daisyui: {
    themes: [
      "light",  // Thème clair par défaut
      "dark",   // Thème sombre par défaut
      "cupcake", // Theme supplémentaire
    ],
  },
}
