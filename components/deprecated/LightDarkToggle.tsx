// /components/ThemeToggle.tsx
'use client'

import { useThemeStore } from '@/stores/theme';
import { Button } from 'primereact/button';

export default function lightDarkToggle() {
    const { theme, toggleTheme } = useThemeStore()

    return (
        <Button
            icon={theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'}
            rounded
            text
            severity="secondary"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        />
    )
}