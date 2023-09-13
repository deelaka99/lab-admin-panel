/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    colors: {
      transparent: 'transparent',
      'primary-blue': '#176B87',
      'secondary-blue': '#64CCC5',
      'ternary-blue': '#DAFFFB',
      'quternary-blue': '#001C30',
      'white': '#ffffff',
      'silver': '#ecebff',
      'black': '#000000',
      'bermuda': '#78dcca',
      'red': '#FF2346',
      'red-1':'#CB4006',
      'red-2':'#FB5249',
      'blue':'#140EDA',
      'yellow':'#EDE610',
      'green':'#3ED10A',
      'dark-primary':'#313131',
      'dark-secondary':'#414141',
      'dark-ternary':'#525252',
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
}

