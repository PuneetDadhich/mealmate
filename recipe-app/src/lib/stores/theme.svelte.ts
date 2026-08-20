import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

let currentTheme = $state<Theme>('dark');

export function initTheme() {
	if (!browser) return;

	const stored = localStorage.getItem('mealmate_theme') as Theme | null;
	if (stored) {
		currentTheme = stored;
	} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
		currentTheme = 'light';
	}

	applyTheme(currentTheme);
}

export function toggleTheme() {
	currentTheme = currentTheme === 'light' ? 'dark' : 'light';
	if (browser) {
		localStorage.setItem('mealmate_theme', currentTheme);
		applyTheme(currentTheme);
	}
}

export function getTheme() {
	return currentTheme;
}

function applyTheme(theme: Theme) {
	if (!browser) return;
	document.documentElement.setAttribute('data-theme', theme);
}
