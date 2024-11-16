// /components/providers/ThemeProvider.tsx

'use client';

import { useThemeStore } from '@/stores/useThemeStore';
import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { currentTheme } = useThemeStore();

    useEffect(() => {
        // Load PrimeReact theme
        const linkId = 'theme-css';
        const themeLink = document.getElementById(linkId) as HTMLLinkElement;
        const themePath = `/primereact/resources/themes/${currentTheme}/theme.css`;

        if (themeLink) {
            themeLink.href = themePath;
        } else {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = themePath;
            document.head.appendChild(link);
        }
    }, [currentTheme]);

    return <>{children}</>;
}