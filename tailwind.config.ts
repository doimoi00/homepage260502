import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F9F8F6',
        'green-deep': '#2C4A2E',
        'green-mid': '#4A7C59',
        'green-light': '#E8F0E9',
        border: '#E5E3DE',
      },
      fontFamily: {
        serif: ['var(--font-noto-serif-kr)', 'Noto Serif KR', 'serif'],
      },
      typography: ({ theme }: { theme: (key: string) => string }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: '#2C4A2E',
              '&:hover': { color: '#4A7C59' },
            },
            'h1,h2,h3,h4': { color: theme('colors.gray.900') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
