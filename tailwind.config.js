/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#30f8ed', // bright-turquoise from logo
          dark: '#24e6be', // turquoise from logo
          light: '#aaf6ec', // ice-cold from logo
          softer: '#aaf6ec',
        },
        accent: {
          DEFAULT: '#00eb62', // spring-green from logo
          soft: '#69f470', // screamin'-green from logo
        },
        dark: {
          DEFAULT: '#0B0B12',
          light: '#12121B',
          lighter: '#1B1B26',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: theme => ({
        'grid-s': "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        'radial-spot': 'radial-gradient(600px circle at var(--spot-x,50%) var(--spot-y,40%), rgba(48,248,237,0.18), transparent 60%)',
        'aurora': 'conic-gradient(from 90deg at 50% 50%, rgba(48,248,237,0.12), rgba(0,235,98,0.08), transparent 60%)',
      }),
      boxShadow: {
        glass: '0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}


