import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // primereact가 관리함
        // background: 'var(--background)',
        // foreground: 'var(--foreground)',
      },
    },
  },
  corePlugins: {
  },
  plugins: [],
} satisfies Config;
