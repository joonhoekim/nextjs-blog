// /components/ThemeSelector.tsx

'use client';

import { THEME_NAMES, useThemeStore } from '@/stores/useThemeStore';
import { Dropdown } from 'primereact/dropdown';

const ThemeSelector = () => {
    const { currentTheme, setTheme } = useThemeStore();

    // Format theme name for display
    const formatThemeName = (name: string) => {
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Create theme options with formatted labels
    const themeOptions = THEME_NAMES.map(name => ({
        name: name,
        label: formatThemeName(name)
    }));

    const selectedTheme = themeOptions.find(t => t.name === currentTheme);

    return (
        <div className="flex items-center gap-4">
            <Dropdown
                value={selectedTheme}
                onChange={(e) => {
                    if (e.value?.name) {
                        setTheme(e.value.name);
                    }
                }}
                options={themeOptions}
                optionLabel="label"
                placeholder="Select a Theme"
                className="w-full md:w-14rem"
                filter
                filterBy="label"
            />
        </div>
    );
};

export default ThemeSelector;