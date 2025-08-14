/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Add any custom colors here if needed
        'blue-primary': '#1E40AF', // Example primary blue
      },
      keyframes: {
        bubble: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.5' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-100vh) scale(1.5)', opacity: '0' },
        },
        'fade-slide': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '50%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-10px)' },
        },
      },
      animation: {
        bubble: 'bubble linear infinite',
        'fade-slide': 'fade-slide 6s infinite',
      },
    },
  },
  plugins: [],
}
