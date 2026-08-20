<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getRecipeById, extractIngredients, type MealDBRecipe } from '$lib/api/mealdb';
	import { isFavorite, toggleFavorite } from '$lib/stores/favorites.svelte';
	import { assignMeal, DAYS, MEAL_TYPES, type DayOfWeek, type MealType } from '$lib/stores/mealplan.svelte';

	let recipe = $state<MealDBRecipe | null>(null);
	let loading = $state(true);
	let showMealPlanModal = $state(false);
	let toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);

	const recipeId = $derived(page.params.id);

	onMount(async () => {
		try {
			recipe = await getRecipeById(recipeId);
		} catch (err) {
			console.error('Failed to load recipe:', err);
		} finally {
			loading = false;
		}
	});

	function getIngredients() {
		if (!recipe) return [];
		return extractIngredients(recipe);
	}

	function getInstructions(): string[] {
		if (!recipe?.strInstructions) return [];
		return recipe.strInstructions
			.split(/\r?\n/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	}

	function handleAddToMealPlan(day: DayOfWeek, mealType: MealType) {
		if (!recipe) return;
		assignMeal(day, mealType, {
			recipeId: recipe.idMeal,
			recipeName: recipe.strMeal,
			recipeImage: recipe.strMealThumb
		});
		showMealPlanModal = false;
		showToast(`Added to ${day} ${mealType}!`, 'success');
	}

	function showToast(message: string, type: 'success' | 'error') {
		toast = { message, type };
		setTimeout(() => (toast = null), 3000);
	}
</script>

<svelte:head>
	{#if recipe}
		<title>{recipe.strMeal} — MealMate</title>
		<meta name="description" content="Recipe for {recipe.strMeal} - {recipe.strCategory} cuisine from {recipe.strArea}" />
	{:else}
		<title>Recipe Details — MealMate</title>
	{/if}
</svelte:head>

<section class="section">
	<div class="container">
		{#if loading}
			<div class="detail-skeleton">
				<div class="skeleton" style="height: 400px; border-radius: var(--radius-lg);"></div>
				<div style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
					<div class="skeleton" style="height: 40px; width: 60%; border-radius: var(--radius-md);"></div>
					<div class="skeleton" style="height: 20px; width: 30%; border-radius: var(--radius-sm);"></div>
					<div class="skeleton" style="height: 200px; border-radius: var(--radius-md);"></div>
				</div>
			</div>
		{:else if !recipe}
			<div class="empty-state">
				<div class="empty-state__icon">😕</div>
				<div class="empty-state__title">Recipe not found</div>
				<p class="empty-state__text">The recipe you are looking for does not exist or has been removed.</p>
				<button class="btn btn--primary" onclick={() => goto(`${base}/recipes`)}>Browse Recipes</button>
			</div>
		{:else}
			<button class="back-btn btn btn--ghost" onclick={() => history.back()}>
				← Back
			</button>

			<div class="detail">
				<div class="detail__hero">
					<img src={recipe.strMealThumb} alt={recipe.strMeal} class="detail__image" />
					<div class="detail__hero-overlay"></div>
				</div>

				<div class="detail__body">
					<div class="detail__header">
						<div class="detail__header-left">
							<h1 class="detail__title">{recipe.strMeal}</h1>
							<div class="detail__tags">
								<tag-badge label={recipe.strCategory} variant="category"></tag-badge>
								<tag-badge label={recipe.strArea} variant="area"></tag-badge>
								{#if recipe.strTags}
									{#each recipe.strTags.split(',').filter(t => t.trim()) as tag}
										<tag-badge label={tag.trim()} variant="default"></tag-badge>
									{/each}
								{/if}
							</div>
						</div>
						<div class="detail__actions">
							<button
								class="btn"
								class:btn--primary={!isFavorite(recipe.idMeal)}
								class:btn--danger={isFavorite(recipe.idMeal)}
								onclick={() => { if (recipe) toggleFavorite(recipe); }}
							>
								{isFavorite(recipe.idMeal) ? '❤️ Favorited' : '🤍 Add to Favorites'}
							</button>
							<button class="btn btn--secondary" onclick={() => (showMealPlanModal = true)}>
								📅 Add to Plan
							</button>
						</div>
					</div>

					<div class="detail__content">
						<div class="detail__ingredients">
							<h2 class="detail__section-title">Ingredients</h2>
							<ul class="ingredients-list">
								{#each getIngredients() as { ingredient, measure }}
									<li class="ingredient-item">
										<span class="ingredient-item__measure">{measure}</span>
										<span class="ingredient-item__name">{ingredient}</span>
									</li>
								{/each}
							</ul>
						</div>

						<div class="detail__instructions">
							<h2 class="detail__section-title">Instructions</h2>
							<ol class="instructions-list">
								{#each getInstructions() as step, i}
									<li class="instruction-step">
										<span class="instruction-step__number">{i + 1}</span>
										<p class="instruction-step__text">{step}</p>
									</li>
								{/each}
							</ol>
						</div>
					</div>

					{#if recipe.strYoutube}
						<div class="detail__video">
							<h2 class="detail__section-title">Video Tutorial</h2>
							<a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" class="video-link btn btn--secondary">
								▶ Watch on YouTube
							</a>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Meal Plan Modal -->
{#if showMealPlanModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="modal-overlay" onclick={() => (showMealPlanModal = false)} role="presentation">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
			<div class="modal__header">
				<h3 class="modal__title">Add to Meal Plan</h3>
				<button class="modal__close" onclick={() => (showMealPlanModal = false)}>✕</button>
			</div>
			<div class="meal-plan-grid">
				{#each DAYS as day}
					<div class="meal-plan-day">
						<h4 class="meal-plan-day__name">{day}</h4>
						<div class="meal-plan-day__slots">
							{#each MEAL_TYPES as mealType}
								<button
									class="meal-plan-slot-btn btn btn--ghost btn--sm"
									onclick={() => handleAddToMealPlan(day, mealType)}
								>
									{mealType === 'breakfast' ? '🌅' : mealType === 'lunch' ? '☀️' : '🌙'}
									{mealType}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<!-- Toast -->
{#if toast}
	<div class="toast toast--{toast.type}">{toast.message}</div>
{/if}

<style>
	.back-btn {
		margin-bottom: var(--space-md);
	}

	.detail {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}

	.detail__hero {
		position: relative;
		border-radius: var(--radius-xl);
		overflow: hidden;
		max-height: 450px;
	}

	.detail__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.detail__hero-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(to top, var(--color-bg), transparent);
	}

	.detail__body {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}

	.detail__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-lg);
		flex-wrap: wrap;
	}

	.detail__title {
		font-size: 2.2rem;
		font-weight: 700;
		margin-bottom: var(--space-sm);
	}

	.detail__tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
	}

	.detail__actions {
		display: flex;
		gap: var(--space-sm);
		flex-shrink: 0;
	}

	.detail__content {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: var(--space-xl);
	}

	.detail__section-title {
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: var(--space-md);
		color: var(--color-text);
	}

	/* Ingredients */
	.detail__ingredients {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		height: fit-content;
		position: sticky;
		top: 80px;
	}

	.ingredients-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.ingredient-item {
		display: flex;
		gap: 8px;
		padding: 8px 10px;
		border-radius: var(--radius-sm);
		background: var(--color-bg-elevated);
		font-size: 0.88rem;
	}

	.ingredient-item__measure {
		color: var(--color-primary);
		font-weight: 600;
		min-width: 80px;
	}

	.ingredient-item__name {
		color: var(--color-text);
	}

	/* Instructions */
	.instructions-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.instruction-step {
		display: flex;
		gap: var(--space-md);
		align-items: flex-start;
	}

	.instruction-step__number {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--color-primary-muted);
		color: var(--color-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.82rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.instruction-step__text {
		font-size: 0.92rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
		padding-top: 4px;
	}

	/* Video */
	.detail__video {
		margin-top: var(--space-md);
	}

	.video-link {
		text-decoration: none;
	}

	/* Meal Plan Modal Grid */
	.meal-plan-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.meal-plan-day {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: 8px 0;
		border-bottom: 1px solid var(--color-border);
	}

	.meal-plan-day:last-child {
		border-bottom: none;
	}

	.meal-plan-day__name {
		width: 100px;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.meal-plan-day__slots {
		display: flex;
		gap: var(--space-sm);
		flex: 1;
	}

	.meal-plan-slot-btn {
		flex: 1;
		text-transform: capitalize;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.detail__content {
			grid-template-columns: 1fr;
		}

		.detail__ingredients {
			position: static;
		}

		.detail__title {
			font-size: 1.6rem;
		}

		.detail__header {
			flex-direction: column;
		}

		.detail__actions {
			width: 100%;
		}

		.detail__actions .btn {
			flex: 1;
		}

		.meal-plan-day {
			flex-direction: column;
			align-items: stretch;
			gap: var(--space-xs);
		}

		.meal-plan-day__name {
			width: auto;
		}
	}
</style>
