// theme.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Helper function to check system theme preference
function getSystemThemePreference() {
    if (!browser) {
        return 'light';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

//colors I would like to use for polyspace, depending on current theme
export const polyspaceColors = {
    light: {
        background: '#ebebeb',
        foreground: '#1a1c1e',
    },
    dark: {
        background: '#1a1c1e',
        foreground: '#ebebeb',
    },
};

// Helper function to load the theme from localStorage, or determine from system preference
function loadInitialTheme() {
    if (!browser) {
        return getSystemThemePreference();
    }
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || getSystemThemePreference();
}

// Store to hold the theme state, initialized with user's last known preference or system preference
export const theme = writable<string>(loadInitialTheme());

if (browser) {
    // Only subscribe to changes and save to localStorage if we're in the browser
    theme.subscribe((value) => {
        localStorage.setItem('theme', value);
    });
}

export const themeAction = (node: HTMLElement) => {
    // Function to update the element with the current theme
    const updateTheme = (themeValue: string) => {
        node.setAttribute('data-theme', themeValue);
    };

    // Subscribe to the theme store
    const unsubscribe = theme.subscribe(updateTheme);

    // Return a cleanup function to unsubscribe when the element is destroyed
    return {
        destroy() {
            unsubscribe();
        },
    };
};
