<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { getUserRecipes, deleteUserRecipe, type UserRecipe } from '$lib/stores/userRecipes.svelte';

	let toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);

	function handleDelete(recipe: UserRecipe) {
		if (confirm(`Delete "${recipe.strMeal}"? This cannot be undone.`)) {
			deleteUserRecipe(recipe.id);
			showToast(`"${recipe.strMeal}" deleted`, 'success');
		}
	}

	function showToast(message: string, type: 'success' | 'error') {
		toast = { message, type };
		setTimeout(() => (toast = null), 3000);
	}
</script>

<svelte:head>
	<title>My Recipes — MealMate</title>
	<meta name="description" content="Create, edit, and manage your own custom recipes." />
</svelte:head>

<section class="section">
	<div class="container">
		<div class="page-header">
			<div class="my-recipes-header">
				<div>
					<h1 class="page-title">My Recipes</h1>
					<p class="page-subtitle">Create and manage your own recipes</p>
				</div>
				<button class="btn btn--primary" onclick={() => goto(`${base}/my-recipes/create`)}>
					+ Create Recipe
				</button>
			</div>
		</div>

		{#if getUserRecipes().length === 0}
			<div class="empty-state">
				<div class="empty-state__icon">📝</div>
				<div class="empty-state__title">No recipes yet</div>
				<p class="empty-state__text">
					Create your first recipe and start building your personal collection.
				</p>
				<button class="btn btn--primary" onclick={() => goto(`${base}/my-recipes/create`)}>
					Create Your First Recipe
				</button>
			</div>
		{:else}
			<div class="recipes-list">
				{#each getUserRecipes() as recipe (recipe.id)}
					<div class="recipe-item card">
						<div class="recipe-item__image-wrapper">
							{#if recipe.strMealThumb}
								<img src={recipe.strMealThumb} alt={recipe.strMeal} class="recipe-item__image" />
							{:else}
								<div class="recipe-item__image-placeholder">🍳</div>
							{/if}
						</div>
						<div class="recipe-item__content">
							<h3 class="recipe-item__title">{recipe.strMeal}</h3>
							<div class="recipe-item__meta">
								{#if recipe.strCategory}
									<tag-badge label={recipe.strCategory} variant="category"></tag-badge>
								{/if}
								{#if recipe.strArea}
									<tag-badge label={recipe.strArea} variant="area"></tag-badge>
								{/if}
							</div>
							<p class="recipe-item__info">
								{recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
								• Created {new Date(recipe.createdAt).toLocaleDateString()}
							</p>
						</div>
						<div class="recipe-item__actions">
							<button class="btn btn--secondary btn--sm" onclick={() => goto(`/my-recipes/create?edit=${recipe.id}`)}>
								✏️ Edit
							</button>
							<button class="btn btn--danger btn--sm" onclick={() => handleDelete(recipe)}>
								🗑️ Delete
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

{#if toast}
	<div class="toast toast--{toast.type}">{toast.message}</div>
{/if}

<style>
	.my-recipes-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-md);
	}

	.recipes-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.recipe-item {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
		padding: var(--space-md);
	}

	.recipe-item__image-wrapper {
		width: 80px;
		height: 80px;
		border-radius: var(--radius-md);
		overflow: hidden;
		flex-shrink: 0;
		background: var(--color-bg-elevated);
	}

	.recipe-item__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.recipe-item__image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		background: var(--color-primary-muted);
	}

	.recipe-item__content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.recipe-item__title {
		font-size: 1.05rem;
		font-weight: 600;
	}

	.recipe-item__meta {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.recipe-item__info {
		font-size: 0.78rem;
		color: var(--color-text-muted);
	}

	.recipe-item__actions {
		display: flex;
		gap: var(--space-sm);
		flex-shrink: 0;
	}

	@media (max-width: 768px) {
		.recipe-item {
			flex-direction: column;
			align-items: stretch;
		}

		.recipe-item__image-wrapper {
			width: 100%;
			height: 160px;
		}

		.recipe-item__actions {
			justify-content: flex-end;
		}

		.my-recipes-header {
			flex-direction: column;
		}
	}
</style>
