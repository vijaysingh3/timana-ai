import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'timana': {
          bg: '#343541',
          sidebar: '#202123',
          user: '#444654',
          input: '#40414F',
          accent: '#10A37F',
          text: '#ECECF1',
          border: '#4D4D4F'
        }
      },
    },
  },
  plugins: [],
}
export default config