/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffd100', // Our theme color
      },
      maxWidth: {
        'container': '448px', // Container width for our mobile-first approach
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-green': 'pulseGreen 1.5s ease-in-out infinite',
        'pulse-red': 'pulseRed 1.5s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGreen: {
          '0%': { 
            boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
            opacity: 0.9
          },
          '50%': {
            opacity: 1
          },
          '70%': { 
            boxShadow: '0 0 0 8px rgba(34, 197, 94, 0)',
            opacity: 0.9
          },
          '100%': { 
            boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)',
            opacity: 0.9 
          },
        },
        pulseRed: {
          '0%': { 
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)',
            opacity: 0.9
          },
          '50%': {
            opacity: 1
          },
          '70%': { 
            boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)',
            opacity: 0.9
          },
          '100%': { 
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)',
            opacity: 0.9
          },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
} 