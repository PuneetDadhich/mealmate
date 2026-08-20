import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

export const themeStore = $state({
	current: 'dark' as Theme
});

export function initTheme() {
	if (!browser) return;
	
	const stored = localStorage.getItem('mealmate_theme') as Theme | null;
	if (stored) {
		themeStore.current = stored;
	} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
		themeStore.current = 'light';
	}
	
	applyTheme(themeStore.current);
}

export function toggleTheme() {
	themeStore.current = themeStore.current === 'light' ? 'dark' : 'light';
	if (browser) {
		localStorage.setItem('mealmate_theme', themeStore.current);
		applyTheme(themeStore.current);
	}
}

function applyTheme(theme: Theme) {
	if (!browser) return;
	document.documentElement.setAttribute('data-theme', theme);
}
