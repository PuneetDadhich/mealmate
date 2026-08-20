<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		getMealPlan,
		removeMeal,
		clearWeek,
		assignMeal,
		DAYS,
		MEAL_TYPES,
		type DayOfWeek,
		type MealType
	} from '$lib/stores/mealplan.svelte';
	import { searchRecipes, type MealDBRecipe } from '$lib/api/mealdb';

	let showSearchModal = $state(false);
	let selectedSlot = $state<{ day: DayOfWeek; mealType: MealType } | null>(null);
	let modalSearchQuery = $state('');
	let modalSearchResults = $state<MealDBRecipe[]>([]);
	let modalSearchLoading = $state(false);
	let toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);
	let searchTimeout: ReturnType<typeof setTimeout>;

	function handleSlotClick(e: CustomEvent) {
		const { day, mealType } = e.detail;
		selectedSlot = { day, mealType };
		showSearchModal = true;
		modalSearchQuery = '';
		modalSearchResults = [];
	}

	function handleMealRemoved(e: CustomEvent) {
		const { day, mealType } = e.detail;
		removeMeal(day as DayOfWeek, mealType as MealType);
		showToast(`Removed meal from ${day} ${mealType}`, 'success');
	}

	async function handleModalSearch() {
		if (!modalSearchQuery.trim()) return;
		modalSearchLoading = true;
		try {
			modalSearchResults = await searchRecipes(modalSearchQuery);
		} catch {
			modalSearchResults = [];
		} finally {
			modalSearchLoading = false;
		}
	}

	function handleModalSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			clearTimeout(searchTimeout);
			handleModalSearch();
		}
	}

	function handleModalSearchInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			handleModalSearch();
		}, 300);
	}

	function selectRecipeForSlot(recipe: MealDBRecipe) {
		if (!selectedSlot) return;
		assignMeal(selectedSlot.day, selectedSlot.mealType, {
			recipeId: recipe.idMeal,
			recipeName: recipe.strMeal,
			recipeImage: recipe.strMealThumb
		});
		showSearchModal = false;
		showToast(`Added "${recipe.strMeal}" to ${selectedSlot.day} ${selectedSlot.mealType}`, 'success');
	}

	function handleClearWeek() {
		if (confirm('Clear all meals for the week?')) {
			clearWeek();
			showToast('Week cleared', 'success');
		}
	}

	function showToast(message: string, type: 'success' | 'error') {
		toast = { message, type };
		setTimeout(() => (toast = null), 3000);
	}
</script>

<svelte:head>
	<title>Meal Planner — MealMate</title>
	<meta name="description" content="Plan your weekly meals by assigning recipes to each day." />
</svelte:head>

<section class="section">
	<div class="container">
		<div class="page-header">
			<div class="planner-header">
				<div>
					<h1 class="page-title">Weekly Meal Planner</h1>
					<p class="page-subtitle">Organize your meals for the week ahead</p>
				</div>
				<button class="btn btn--danger btn--sm" onclick={handleClearWeek}>
					🗑️ Clear Week
				</button>
			</div>
		</div>

		<div class="planner-grid">
			{#each DAYS as day}
				<div class="planner-day">
					<h3 class="planner-day__name">{day}</h3>
					<div class="planner-day__slots">
						{#each MEAL_TYPES as mealType}
							{@const meal = getMealPlan()[day][mealType]}
							<meal-day-slot
								day-name={day}
								meal-type={mealType}
								is-empty={!meal}
								recipe-name={meal?.recipeName || ''}
								recipe-image={meal?.recipeImage || ''}
								recipe-id={meal?.recipeId || ''}
								onslotClicked={handleSlotClick}
								onmealRemoved={handleMealRemoved}
							></meal-day-slot>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Search Recipe Modal -->
{#if showSearchModal && selectedSlot}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="modal-overlay" onclick={() => (showSearchModal = false)} role="presentation">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1" style="max-width: 600px;">
			<div class="modal__header">
				<h3 class="modal__title">
					Add {selectedSlot.mealType} for {selectedSlot.day}
				</h3>
				<button class="modal__close" onclick={() => (showSearchModal = false)}>✕</button>
			</div>

			<div class="modal-search">
				<div class="modal-search__wrapper">
					<input
						type="text"
						class="form-input"
						placeholder="Search for a recipe..."
						bind:value={modalSearchQuery}
						oninput={handleModalSearchInput}
						onkeydown={handleModalSearchKeydown}
					/>
					<button class="btn btn--primary btn--sm" onclick={handleModalSearch}>Search</button>
				</div>
			</div>

			{#if modalSearchLoading}
				<div class="modal-loading">
					<div class="skeleton" style="height: 50px; border-radius: var(--radius-md); margin-bottom: 8px;"></div>
					<div class="skeleton" style="height: 50px; border-radius: var(--radius-md); margin-bottom: 8px;"></div>
					<div class="skeleton" style="height: 50px; border-radius: var(--radius-md);"></div>
				</div>
			{:else if modalSearchResults.length > 0}
				<ul class="modal-results">
					{#each modalSearchResults as recipe}
						<li>
							<button class="modal-result-item" onclick={() => selectRecipeForSlot(recipe)}>
								<img src={recipe.strMealThumb} alt={recipe.strMeal} class="modal-result-item__img" />
								<div class="modal-result-item__info">
									<span class="modal-result-item__name">{recipe.strMeal}</span>
									<span class="modal-result-item__meta">{recipe.strCategory} • {recipe.strArea}</span>
								</div>
							</button>
						</li>
					{/each}
				</ul>
			{:else if modalSearchQuery}
				<p class="modal-empty">No recipes found. Try a different search.</p>
			{:else}
				<p class="modal-empty">Search for a recipe to add to your meal plan.</p>
			{/if}
		</div>
	</div>
{/if}

{#if toast}
	<div class="toast toast--{toast.type}">{toast.message}</div>
{/if}

<style>
	.planner-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-md);
	}

	.planner-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: var(--space-md);
	}

	.planner-day {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.planner-day__name {
		font-size: 0.88rem;
		font-weight: 700;
		text-align: center;
		padding: 8px;
		background: var(--color-primary-muted);
		color: var(--color-primary);
		border-radius: var(--radius-md);
	}

	.planner-day__slots {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	/* Modal Search */
	.modal-search {
		margin-bottom: var(--space-md);
	}

	.modal-search__wrapper {
		display: flex;
		gap: var(--space-sm);
	}

	.modal-search__wrapper .form-input {
		flex: 1;
	}

	.modal-results {
		list-style: none;
		max-height: 400px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.modal-result-item {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: 10px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		width: 100%;
		text-align: left;
	}

	.modal-result-item:hover {
		border-color: var(--color-primary-muted);
		background: var(--color-surface-hover);
	}

	.modal-result-item__img {
		width: 44px;
		height: 44px;
		border-radius: var(--radius-sm);
		object-fit: cover;
		flex-shrink: 0;
	}

	.modal-result-item__info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.modal-result-item__name {
		font-size: 0.88rem;
		font-weight: 500;
		color: var(--color-text);
	}

	.modal-result-item__meta {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.modal-empty {
		text-align: center;
		padding: var(--space-lg);
		color: var(--color-text-muted);
		font-size: 0.88rem;
	}

	.modal-loading {
		padding: var(--space-sm) 0;
	}

	@media (max-width: 1024px) {
		.planner-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 768px) {
		.planner-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.planner-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
