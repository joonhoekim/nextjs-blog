'use client';


import { SessionProvider } from "next-auth/react";
import { PrimeReactProvider } from "primereact/api";
import 'primereact/resources/themes/lara-dark-blue/theme.css';
import ThemeProvider from './ThemeProvider';

export function ClientProviders({ children }: { children: React.ReactNode }) {

    const value = {
        ripple: true,
    };

    return (
        <SessionProvider>
            <PrimeReactProvider value={value}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </PrimeReactProvider>
        </SessionProvider>
    );
}
