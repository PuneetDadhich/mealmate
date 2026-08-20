<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { initTheme, toggleTheme, themeStore } from '$lib/stores/theme.svelte';
	import '../app.css';

	let { children } = $props();

	let mobileMenuOpen = $state(false);

	onMount(async () => {
		initTheme();
		if (browser) {
			await import('mealmate-ui/dist/components/meal-day-slot.js');
			await import('mealmate-ui/dist/components/recipe-card.js');
			await import('mealmate-ui/dist/components/recipe-search.js');
			await import('mealmate-ui/dist/components/star-rating.js');
			await import('mealmate-ui/dist/components/tag-badge.js');
		}
	});

	import { base } from '$app/paths';

	const navItems = [
		{ href: `${base}/`, label: 'Home', icon: '🏠' },
		{ href: `${base}/recipes`, label: 'Recipes', icon: '🍳' },
		{ href: `${base}/favorites`, label: 'Favorites', icon: '❤️' },
		{ href: `${base}/meal-planner`, label: 'Planner', icon: '📅' },
		{ href: `${base}/my-recipes`, label: 'My Recipes', icon: '📝' }
	];

	function isActive(href: string): boolean {
		if (href === base || href === `${base}/`) {
			return page.url.pathname === base || page.url.pathname === `${base}/`;
		}
		return page.url.pathname.startsWith(href);
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<div class="app-layout">
	<nav class="navbar glass">
		<div class="navbar__inner container">
			<a href="{base}/" class="navbar__brand" onclick={closeMobileMenu}>
				<span class="navbar__logo">🍽️</span>
				<span class="navbar__title">MealMate</span>
			</a>

			<div class="navbar__links" class:navbar__links--open={mobileMenuOpen}>
				{#each navItems as item}
					<a
						href={item.href}
						class="navbar__link"
						class:navbar__link--active={isActive(item.href)}
						onclick={closeMobileMenu}
					>
						<span class="navbar__link-icon">{item.icon}</span>
						<span class="navbar__link-label">{item.label}</span>
					</a>
				{/each}
				<button 
					class="theme-switch" 
					class:theme-switch--dark={themeStore.current === 'dark'}
					onclick={toggleTheme} 
					aria-label="Toggle Theme"
				>
					<span class="theme-switch__thumb">
						<span class="theme-switch__icon">{themeStore.current === 'light' ? '☀️' : '🌙'}</span>
					</span>
				</button>
			</div>

			<button
				class="navbar__burger"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				<span class="navbar__burger-line" class:navbar__burger-line--open={mobileMenuOpen}></span>
				<span class="navbar__burger-line" class:navbar__burger-line--open={mobileMenuOpen}></span>
				<span class="navbar__burger-line" class:navbar__burger-line--open={mobileMenuOpen}></span>
			</button>
		</div>
	</nav>

	{#if mobileMenuOpen}
		<div class="navbar__overlay" onclick={closeMobileMenu} role="presentation"></div>
	{/if}

	<main class="main-content">
		{@render children()}
	</main>

	<footer class="footer">
		<div class="container">
			<p class="footer__text">
				Built with ❤️ using SvelteKit & StencilJS • Powered by
				<a href="https://www.themealdb.com" target="_blank" rel="noopener noreferrer" class="footer__link">TheMealDB</a>
			</p>
		</div>
	</footer>
</div>

<style>
	.app-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/* ============================================
	   Navbar
	   ============================================ */
	.navbar {
		position: sticky;
		top: 0;
		z-index: 50;
		border-bottom: 1px solid var(--color-border);
	}

	.navbar__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}

	.navbar__brand {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
	}

	.navbar__logo {
		font-size: 1.5rem;
	}

	.navbar__title {
		font-size: 1.2rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.navbar__links {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.navbar__link {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		border-radius: var(--radius-md);
		font-size: 0.88rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		transition: all var(--transition-fast);
		text-decoration: none;
	}

	.navbar__link:hover {
		color: var(--color-text);
		background: var(--color-border);
	}

	.navbar__link--active {
		color: var(--color-primary);
		background: var(--color-primary-muted);
	}

	.navbar__link-icon {
		font-size: 1rem;
	}

	.theme-switch {
		position: relative;
		width: 44px;
		height: 24px;
		border-radius: 20px;
		background: #e2e8f0;
		border: 1px solid var(--color-border);
		cursor: pointer;
		padding: 0;
		margin: 0 0 0 12px;
		transition: background-color 0.3s ease;
		outline: none;
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.theme-switch--dark {
		background: #1e293b;
	}

	.theme-switch__thumb {
		position: absolute;
		left: 1px;
		width: 20px;
		height: 20px;
		background: #ffffff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 5px rgba(0,0,0,0.2);
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.theme-switch--dark .theme-switch__thumb {
		transform: translateX(20px);
		background: #0f172a;
	}

	.theme-switch__icon {
		font-size: 10px;
		line-height: 1;
		margin-top: -1px;
	}

	.navbar__burger {
		display: none;
		flex-direction: column;
		gap: 5px;
		padding: 8px;
		background: none;
		border: none;
	}

	.navbar__burger-line {
		display: block;
		width: 22px;
		height: 2px;
		background: var(--color-text);
		border-radius: 1px;
		transition: all var(--transition-base);
	}

	.navbar__burger-line--open:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.navbar__burger-line--open:nth-child(2) {
		opacity: 0;
	}

	.navbar__burger-line--open:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	.navbar__overlay {
		display: none;
	}

	/* ============================================
	   Main Content
	   ============================================ */
	.main-content {
		flex: 1;
	}

	/* ============================================
	   Footer
	   ============================================ */
	.footer {
		border-top: 1px solid var(--color-border);
		padding: var(--space-lg) 0;
		margin-top: var(--space-3xl);
	}

	.footer__text {
		text-align: center;
		font-size: 0.82rem;
		color: var(--color-text-muted);
	}

	.footer__link {
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.footer__link:hover {
		color: var(--color-primary-hover);
	}

	/* ============================================
	   Mobile
	   ============================================ */
	@media (max-width: 768px) {
		.navbar__links {
			display: none;
			position: absolute;
			top: 64px;
			left: 0;
			right: 0;
			height: calc(100vh - 64px);
			background: var(--color-bg-elevated);
			flex-direction: column;
			padding: var(--space-lg);
			gap: var(--space-sm);
			z-index: 49;
			animation: slide-down 0.2s ease;
		}

		.navbar__links--open {
			display: flex;
		}

		.navbar__link {
			padding: 14px 16px;
			font-size: 1rem;
			border-radius: var(--radius-md);
		}

		.theme-switch {
			margin-left: 4px;
			margin-top: 8px;
			align-self: flex-start;
		}

		.navbar__burger {
			display: flex;
		}

		.navbar__overlay {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 48;
		}
	}
</style>
