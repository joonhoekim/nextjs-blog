// /stores/useThemeStore.ts

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// All available themes from the public/primereact/resources/themes directory
export const THEME_NAMES = [
  'arya-blue',
  'arya-green',
  'arya-orange',
  'arya-purple',
  'bootstrap4-dark-blue',
  'bootstrap4-dark-purple',
  'bootstrap4-light-blue',
  'bootstrap4-light-purple',
  'fluent-light',
  'lara-dark-amber',
  'lara-dark-blue',
  'lara-dark-cyan',
  'lara-dark-green',
  'lara-dark-indigo',
  'lara-dark-pink',
  'lara-dark-purple',
  'lara-dark-teal',
  'lara-light-amber',
  'lara-light-blue',
  'lara-light-cyan',
  'lara-light-green',
  'lara-light-indigo',
  'lara-light-pink',
  'lara-light-purple',
  'lara-light-teal',
  'luna-amber',
  'luna-blue',
  'luna-green',
  'luna-pink',
  'mdc-dark-deeppurple',
  'mdc-dark-indigo',
  'mdc-light-deeppurple',
  'mdc-light-indigo',
  'md-dark-deeppurple',
  'md-dark-indigo',
  'md-light-deeppurple',
  'md-light-indigo',
  'mira',
  'nano',
  'nova',
  'nova-accent',
  'nova-alt',
  'rhea',
  'saga-blue',
  'saga-green',
  'saga-orange',
  'saga-purple',
  'soho-dark',
  'soho-light',
  'tailwind-light',
  'vela-blue',
  'vela-green',
  'vela-orange',
  'vela-purple',
  'viva-dark',
  'viva-light',
] as const;

export type ThemeName = (typeof THEME_NAMES)[number];

interface ThemeState {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: 'lara-light-blue',
      setTheme: (theme) => set({ currentTheme: theme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
