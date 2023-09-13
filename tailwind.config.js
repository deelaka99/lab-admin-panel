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
      'blue':'#2155CD',
      'blue1':'#0AA1DD',
      'primary-blue': '#42C2FF',
      'secondary-blue': '#42C2FF',
      'ternary-blue': '#E8F9FD',
      'quternary-blue': '#FDFDFD',
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
      'gray1':'#D9D9D9',
      'gray2':'#B3B5B6',
      'dark-primary':'#313131',
      'dark-secondary':'#414141',
      'dark-ternary':'#525252',
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      jomhuria: ["Jomhuria", "cursive"]
    },
  },
  plugins: [],
}

