<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import {
		searchRecipes,
		filterByCategory,
		filterByArea,
		getCategoryNames,
		getAreaNames,
		getRecipeById,
		listByFirstLetter,
		type MealDBRecipe,
		type MealDBFilterResult
	} from '$lib/api/mealdb';
	import { isFavorite, toggleFavorite } from '$lib/stores/favorites.svelte';

	let recipes = $state<MealDBRecipe[]>([]);
	let categories = $state<string[]>([]);
	let areas = $state<string[]>([]);
	let loading = $state(true);
	let selectedCategory = $state('');
	let selectedArea = $state('');
	let searchQuery = $state('');

	onMount(async () => {
		const [cats, areaList] = await Promise.all([getCategoryNames(), getAreaNames()]);
		categories = cats;
		areas = areaList;

		const urlQ = page.url.searchParams.get('q');
		const urlCat = page.url.searchParams.get('category');

		if (urlQ) {
			searchQuery = urlQ;
			await doSearch(urlQ);
		} else if (urlCat) {
			selectedCategory = urlCat;
			await doFilterCategory(urlCat);
		} else {
			await loadDefault();
		}
	});

	async function loadDefault() {
		loading = true;
		try {
			const results = await searchRecipes('');
			recipes = results;
		} catch (err) {
			console.error('Failed to load recipes:', err);
		} finally {
			loading = false;
		}
	}

	async function doSearch(query: string) {
		loading = true;
		try {
			recipes = await searchRecipes(query);
		} catch (err) {
			console.error('Search failed:', err);
			recipes = [];
		} finally {
			loading = false;
		}
	}

	async function doFilterCategory(category: string) {
		loading = true;
		try {
			const filtered: MealDBFilterResult[] = await filterByCategory(category);
			const detailed = await Promise.all(
				filtered.slice(0, 20).map((r) => getRecipeById(r.idMeal))
			);
			recipes = detailed.filter((r): r is MealDBRecipe => r !== null);
		} catch (err) {
			console.error('Filter failed:', err);
			recipes = [];
		} finally {
			loading = false;
		}
	}

	async function doFilterArea(area: string) {
		loading = true;
		try {
			const filtered: MealDBFilterResult[] = await filterByArea(area);
			const detailed = await Promise.all(
				filtered.slice(0, 20).map((r) => getRecipeById(r.idMeal))
			);
			recipes = detailed.filter((r): r is MealDBRecipe => r !== null);
		} catch (err) {
			console.error('Filter failed:', err);
			recipes = [];
		} finally {
			loading = false;
		}
	}

	function handleSearchChanged(e: CustomEvent) {
		const query = e.detail;
		searchQuery = query;
		if (query.trim()) {
			selectedCategory = '';
			selectedArea = '';
			doSearch(query);
		} else if (!selectedCategory && !selectedArea) {
			loadDefault();
		}
	}

	function handleCategoryChanged(e: CustomEvent) {
		const cat = e.detail;
		selectedCategory = cat;
		selectedArea = '';
		searchQuery = '';
		if (cat) {
			doFilterCategory(cat);
		} else {
			loadDefault();
		}
	}

	function handleAreaChanged(e: CustomEvent) {
		const area = e.detail;
		selectedArea = area;
		selectedCategory = '';
		searchQuery = '';
		if (area) {
			doFilterArea(area);
		} else {
			loadDefault();
		}
	}
</script>

<svelte:head>
	<title>Browse Recipes — MealMate</title>
	<meta name="description" content="Search and filter through thousands of recipes by category, cuisine, and more." />
</svelte:head>

<section class="section">
	<div class="container">
		<div class="page-header">
			<h1 class="page-title">Explore Recipes</h1>
			<p class="page-subtitle">Search, filter, and discover your next favorite dish</p>
		</div>

		<div class="search-wrapper">
			<recipe-search
				placeholder="Search recipes by name..."
				value={searchQuery}
				categories={JSON.stringify(categories)}
				areas={JSON.stringify(areas)}
				selected-category={selectedCategory}
				selected-area={selectedArea}
				onsearchChanged={handleSearchChanged}
				oncategoryChanged={handleCategoryChanged}
				onareaChanged={handleAreaChanged}
			></recipe-search>
		</div>

		{#if loading}
			<div class="recipe-grid">
				{#each Array(8) as _}
					<div class="skeleton" style="height: 300px; border-radius: var(--radius-lg);"></div>
				{/each}
			</div>
		{:else if recipes.length === 0}
			<div class="empty-state">
				<div class="empty-state__icon">🔍</div>
				<div class="empty-state__title">No recipes found</div>
				<p class="empty-state__text">
					Try a different search term or filter to discover more recipes.
				</p>
				<button class="btn btn--secondary" onclick={loadDefault}>Browse All</button>
			</div>
		{:else}
			<div class="results-info">
				<span>{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found</span>
			</div>
			<div class="recipe-grid">
				{#each recipes as recipe (recipe.idMeal)}
					<recipe-card
						recipe-id={recipe.idMeal}
						recipe-title={recipe.strMeal}
						recipe-image={recipe.strMealThumb}
						recipe-category={recipe.strCategory}
						recipe-area={recipe.strArea}
						is-favorite={isFavorite(recipe.idMeal)}
						oncardClicked={(e: CustomEvent) => goto(`${base}/recipes/${e.detail.id}`)}
						onfavoriteToggled={() => toggleFavorite(recipe)}
					></recipe-card>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.search-wrapper {
		margin-bottom: var(--space-xl);
	}

	.results-info {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
		margin-bottom: var(--space-md);
	}
</style>
