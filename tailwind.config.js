module.exports = {
  content: [
    './index.html', 
    './src/**/*.{js,jsx,ts,tsx,vue}' // Add the paths to all your template files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss'),
    require('@material-tailwind/react'),
    require('flowbite/plugin'),
    require('tailwind-elements'),
    require('wind-ui'),
    require('kometa-ui'),
    require('meraki-ui'),
    require('lofi-ui')
  ],
  daisyui: {
    themes: ["light", "dark"], // Add or customize themes here
  },
}
