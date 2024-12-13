import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        '[auto,auto,1fr]': 'auto auto 1fr',
      },
    },
  },
  plugins: [
    forms,
    aspectRatio,
  ],
}

