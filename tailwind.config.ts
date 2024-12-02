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
    // 동적 테마 변경이 필요해서 비활성화했었는데, 해결책을 찾음.
    // I added a comemnt on this issue! https://github.com/primefaces/primereact/issues/6273
    // preflight: false,
  },
  plugins: [],
} satisfies Config;
