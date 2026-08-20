<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { getFavorites, removeFavorite, isFavorite, toggleFavorite } from '$lib/stores/favorites.svelte';
</script>

<svelte:head>
	<title>Favorites — MealMate</title>
	<meta name="description" content="Your favorite recipes saved for quick access." />
</svelte:head>

<section class="section">
	<div class="container">
		<div class="page-header">
			<h1 class="page-title">Your Favorites</h1>
			<p class="page-subtitle">All the recipes you've loved, in one place</p>
		</div>

		{#if getFavorites().length === 0}
			<div class="empty-state">
				<div class="empty-state__icon">💛</div>
				<div class="empty-state__title">No favorites yet</div>
				<p class="empty-state__text">
					Start exploring recipes and tap the heart to save your favorites here.
				</p>
				<button class="btn btn--primary" onclick={() => goto(`${base}/recipes`)}>Explore Recipes</button>
			</div>
		{:else}
			<div class="favorites-header">
				<span class="favorites-count">{getFavorites().length} favorite{getFavorites().length !== 1 ? 's' : ''}</span>
			</div>
			<div class="recipe-grid">
				{#each getFavorites() as recipe (recipe.idMeal)}
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
	.favorites-header {
		margin-bottom: var(--space-md);
	}

	.favorites-count {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}
</style>
