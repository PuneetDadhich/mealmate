<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { getRandomRecipes, getCategories, type MealDBRecipe, type MealDBCategory } from '$lib/api/mealdb';
	import { isFavorite, toggleFavorite, getFavoriteCount } from '$lib/stores/favorites.svelte';
	import { getPlannedMealCount } from '$lib/stores/mealplan.svelte';
	import { getUserRecipeCount } from '$lib/stores/userRecipes.svelte';

	let featuredRecipes = $state<MealDBRecipe[]>([]);
	let categories = $state<MealDBCategory[]>([]);
	let loading = $state(true);
	let searchQuery = $state('');

	onMount(async () => {
		try {
			const [recipes, cats] = await Promise.all([
				getRandomRecipes(8),
				getCategories()
			]);
			featuredRecipes = recipes;
			categories = cats.slice(0, 8);
		} catch (err) {
			console.error('Failed to load home data:', err);
		} finally {
			loading = false;
		}
	});

	function handleSearch() {
		if (searchQuery.trim()) {
			goto(`${base}/recipes?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleSearch();
	}

	function navigateToRecipe(id: string) {
		goto(`${base}/recipes/${id}`);
	}

	function handleFavoriteToggle(recipe: MealDBRecipe) {
		toggleFavorite(recipe);
	}
</script>

<svelte:head>
	<title>MealMate — Recipe Finder & Meal Planner</title>
</svelte:head>

<!-- Hero Section -->
<section class="hero">
	<div class="hero__bg"></div>
	<div class="container hero__content">
		<div class="hero__text">
			<h1 class="hero__title">
				Discover, Plan &<br />
				<span class="hero__title-accent">Cook Amazing Meals</span>
			</h1>
			<p class="hero__subtitle">
				Browse thousands of recipes, organize your favorites, and plan your weekly meals — all in one place.
			</p>
			<div class="hero__search">
				<div class="hero__search-wrapper">
					<svg class="hero__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					<input
						type="text"
						class="hero__search-input"
						placeholder="Search for a recipe..."
						bind:value={searchQuery}
						onkeydown={handleSearchKeydown}
					/>
					<button class="btn btn--primary hero__search-btn" onclick={handleSearch}>
						Search
					</button>
				</div>
			</div>
		</div>

		<div class="hero__stats">
			<div class="stat-card">
				<span class="stat-card__value">{getFavoriteCount()}</span>
				<span class="stat-card__label">Favorites</span>
			</div>
			<div class="stat-card">
				<span class="stat-card__value">{getPlannedMealCount()}</span>
				<span class="stat-card__label">Planned Meals</span>
			</div>
			<div class="stat-card">
				<span class="stat-card__value">{getUserRecipeCount()}</span>
				<span class="stat-card__label">My Recipes</span>
			</div>
		</div>
	</div>
</section>

<!-- Categories Section -->
<section class="section">
	<div class="container">
		<div class="section-header">
			<h2 class="section-title">Browse by Category</h2>
			<a href="{base}/recipes" class="section-link">View All →</a>
		</div>

		{#if loading}
			<div class="categories-grid">
				{#each Array(8) as _}
					<div class="category-card skeleton" style="height: 120px;"></div>
				{/each}
			</div>
		{:else}
			<div class="categories-grid">
				{#each categories as cat}
					<a
						href="{base}/recipes?category={encodeURIComponent(cat.strCategory)}"
						class="category-card"
					>
						<img
							src={cat.strCategoryThumb}
							alt={cat.strCategory}
							class="category-card__img"
							loading="lazy"
						/>
						<span class="category-card__name">{cat.strCategory}</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Featured Recipes Section -->
<section class="section">
	<div class="container">
		<div class="section-header">
			<h2 class="section-title">Featured Recipes</h2>
			<a href="{base}/recipes" class="section-link">Explore More →</a>
		</div>

		{#if loading}
			<div class="recipe-grid">
				{#each Array(8) as _}
					<div class="skeleton" style="height: 300px; border-radius: var(--radius-lg);"></div>
				{/each}
			</div>
		{:else}
			<div class="recipe-grid">
				{#each featuredRecipes as recipe}
					<recipe-card
						recipe-id={recipe.idMeal}
						recipe-title={recipe.strMeal}
						recipe-image={recipe.strMealThumb}
						recipe-category={recipe.strCategory}
						recipe-area={recipe.strArea}
						is-favorite={isFavorite(recipe.idMeal)}
						oncardClicked={(e: CustomEvent) => navigateToRecipe(e.detail.id)}
						onfavoriteToggled={() => handleFavoriteToggle(recipe)}
					></recipe-card>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	/* ============================================
	   Hero
	   ============================================ */
	.hero {
		position: relative;
		padding: var(--space-3xl) 0 var(--space-2xl);
		overflow: hidden;
	}

	.hero__bg {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse at 20% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 60%),
			radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.06) 0%, transparent 60%);
		z-index: -1;
	}

	.hero__content {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xl);
	}

	.hero__text {
		max-width: 680px;
	}

	.hero__title {
		font-size: 3.2rem;
		font-weight: 800;
		line-height: 1.1;
		margin-bottom: var(--space-md);
		color: var(--color-text);
	}

	.hero__title-accent {
		background: linear-gradient(135deg, var(--color-primary), #fbbf24, var(--color-accent));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero__subtitle {
		font-size: 1.1rem;
		color: var(--color-text-secondary);
		line-height: 1.7;
		margin-bottom: var(--space-xl);
		max-width: 540px;
	}

	.hero__search-wrapper {
		display: flex;
		align-items: center;
		background: var(--color-surface);
		border: 1.5px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: border-color var(--transition-fast);
	}

	.hero__search-wrapper:focus-within {
		border-color: rgba(245, 158, 11, 0.4);
		box-shadow: 0 0 0 3px var(--color-primary-muted);
	}

	.hero__search-icon {
		width: 20px;
		height: 20px;
		margin-left: 16px;
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.hero__search-input {
		flex: 1;
		padding: 14px 12px;
		border: none;
		background: transparent;
		color: var(--color-text);
		font-size: 0.95rem;
		outline: none;
	}

	.hero__search-input::placeholder {
		color: var(--color-text-muted);
	}

	.hero__search-btn {
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
		height: 100%;
		padding: 14px 24px;
	}

	/* Stats */
	.hero__stats {
		display: flex;
		gap: var(--space-md);
	}

	.stat-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 16px 24px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		transition: all var(--transition-base);
	}

	.stat-card:hover {
		border-color: var(--color-border-hover);
		transform: translateY(-2px);
	}

	.stat-card__value {
		font-size: 1.8rem;
		font-weight: 700;
		color: var(--color-primary);
	}

	.stat-card__label {
		font-size: 0.78rem;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* ============================================
	   Section
	   ============================================ */
	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-xl);
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.section-link {
		font-size: 0.88rem;
		color: var(--color-primary);
		font-weight: 500;
		transition: color var(--transition-fast);
	}

	.section-link:hover {
		color: var(--color-primary-hover);
	}

	/* ============================================
	   Categories Grid
	   ============================================ */
	.categories-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: var(--space-md);
	}

	.category-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 16px 12px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all var(--transition-base);
	}

	.category-card:hover {
		border-color: var(--color-primary-muted);
		transform: translateY(-3px);
		box-shadow: var(--shadow-md);
	}

	.category-card__img {
		width: 60px;
		height: 60px;
		object-fit: contain;
	}

	.category-card__name {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--color-text);
		text-align: center;
	}

	/* ============================================
	   Responsive
	   ============================================ */
	@media (max-width: 768px) {
		.hero__title {
			font-size: 2.2rem;
		}

		.hero__subtitle {
			font-size: 0.95rem;
		}

		.hero__stats {
			flex-wrap: wrap;
		}

		.stat-card {
			flex: 1;
			min-width: 100px;
			padding: 12px 16px;
		}

		.stat-card__value {
			font-size: 1.4rem;
		}

		.categories-grid {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		}
	}
</style>
