'use client';

import { useThemeStore } from '@/stores/theme'; // 테마 상태 관리
import { SessionProvider } from "next-auth/react";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect } from 'react';
import ThemeProvider from './ThemeProvider';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore(); // light/dark 상태를 가져옴

    useEffect(() => {
        // 동적으로 테마 CSS 로드
        const themeLink = document.getElementById('theme-css') as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = `/primereact/resources/themes/lara-${theme}-blue/theme.css`;
        }
        console.log(theme)
    }, [theme]); // theme 값이 변경될 때마다 실행

    const value = {
        ripple: true,
    };

    return (
        <SessionProvider>
            <PrimeReactProvider value={value}>
                <ThemeProvider>
                    <link
                        id="theme-css"
                        rel="stylesheet"
                        href={`/primereact/resources/themes/lara-${theme}-blue/theme.css`} // 초기 테마
                    />
                    {children}
                </ThemeProvider>
            </PrimeReactProvider>
        </SessionProvider>
    );
}
