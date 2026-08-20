<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import {
		addUserRecipe,
		updateUserRecipe,
		getUserRecipeById,
		validateRecipe,
		type UserRecipe,
		type RecipeFormErrors
	} from '$lib/stores/userRecipes.svelte';
	import { getCategoryNames, getAreaNames } from '$lib/api/mealdb';

	let isEdit = $state(false);
	let editId = $state('');
	let categories = $state<string[]>([]);
	let areas = $state<string[]>([]);
	let formErrors = $state<RecipeFormErrors>({});
	let toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);

	let formData = $state({
		strMeal: '',
		strCategory: '',
		strArea: '',
		strMealThumb: '',
		strInstructions: '',
		strTags: '',
		ingredients: [{ ingredient: '', measure: '' }] as { ingredient: string; measure: string }[]
	});

	onMount(async () => {
		const [cats, areaList] = await Promise.all([getCategoryNames(), getAreaNames()]);
		categories = cats;
		areas = areaList;

		const editParam = page.url.searchParams.get('edit');
		if (editParam) {
			const existing = getUserRecipeById(editParam);
			if (existing) {
				isEdit = true;
				editId = editParam;
				formData = {
					strMeal: existing.strMeal,
					strCategory: existing.strCategory,
					strArea: existing.strArea,
					strMealThumb: existing.strMealThumb,
					strInstructions: existing.strInstructions,
					strTags: existing.strTags,
					ingredients: [...existing.ingredients]
				};
			}
		}
	});

	function addIngredient() {
		formData.ingredients = [...formData.ingredients, { ingredient: '', measure: '' }];
	}

	function removeIngredient(index: number) {
		formData.ingredients = formData.ingredients.filter((_, i) => i !== index);
	}

	function handleSubmit() {
		const { valid, errors } = validateRecipe(formData);
		formErrors = errors;
		if (!valid) return;

		if (isEdit) {
			updateUserRecipe(editId, formData);
			showToast('Recipe updated!', 'success');
		} else {
			addUserRecipe(formData);
			showToast('Recipe created!', 'success');
		}

		setTimeout(() => goto(`${base}/my-recipes`), 500);
	}

	function showToast(message: string, type: 'success' | 'error') {
		toast = { message, type };
		setTimeout(() => (toast = null), 3000);
	}
</script>

<svelte:head>
	<title>{isEdit ? 'Edit Recipe' : 'Create Recipe'} — MealMate</title>
</svelte:head>

<section class="section">
	<div class="container">
		<button class="btn btn--ghost" onclick={() => goto(`${base}/my-recipes`)} style="margin-bottom: var(--space-md);">
			← Back to My Recipes
		</button>

		<div class="page-header">
			<h1 class="page-title">{isEdit ? 'Edit Recipe' : 'Create New Recipe'}</h1>
			<p class="page-subtitle">
				{isEdit ? 'Update your recipe details' : 'Add your own recipe to the collection'}
			</p>
		</div>

		<form class="recipe-form card" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
			<div class="form-grid">
				<div class="form-group">
					<label class="form-label" for="recipe-name">Recipe Name *</label>
					<input
						id="recipe-name"
						type="text"
						class="form-input"
						placeholder="e.g. Grandma's Apple Pie"
						bind:value={formData.strMeal}
					/>
					{#if formErrors.strMeal}
						<span class="form-error">{formErrors.strMeal}</span>
					{/if}
				</div>

				<div class="form-row">
					<div class="form-group">
						<label class="form-label" for="recipe-category">Category *</label>
						<select id="recipe-category" class="form-select" bind:value={formData.strCategory}>
							<option value="">Select category</option>
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
						{#if formErrors.strCategory}
							<span class="form-error">{formErrors.strCategory}</span>
						{/if}
					</div>

					<div class="form-group">
						<label class="form-label" for="recipe-area">Cuisine</label>
						<select id="recipe-area" class="form-select" bind:value={formData.strArea}>
							<option value="">Select cuisine</option>
							{#each areas as area}
								<option value={area}>{area}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="form-group">
					<label class="form-label" for="recipe-image">Image URL</label>
					<input
						id="recipe-image"
						type="url"
						class="form-input"
						placeholder="https://example.com/image.jpg"
						bind:value={formData.strMealThumb}
					/>
				</div>

				<div class="form-group">
					<label class="form-label" for="recipe-tags">Tags (comma separated)</label>
					<input
						id="recipe-tags"
						type="text"
						class="form-input"
						placeholder="e.g. healthy, quick, vegetarian"
						bind:value={formData.strTags}
					/>
				</div>

				<!-- Ingredients -->
				<div class="form-group">
					<div class="ingredients-header">
						<span class="form-label">Ingredients *</span>
						<button type="button" class="btn btn--ghost btn--sm" onclick={addIngredient}>
							+ Add Ingredient
						</button>
					</div>
					{#if formErrors.ingredients}
						<span class="form-error">{formErrors.ingredients}</span>
					{/if}
					<div class="ingredients-form-list">
						{#each formData.ingredients as ing, i}
							<div class="ingredient-row">
								<input
									type="text"
									class="form-input"
									placeholder="Measure (e.g. 2 cups)"
									bind:value={formData.ingredients[i].measure}
								/>
								<input
									type="text"
									class="form-input"
									placeholder="Ingredient name *"
									bind:value={formData.ingredients[i].ingredient}
								/>
								{#if formData.ingredients.length > 1}
									<button
										type="button"
										class="btn btn--danger btn--icon btn--sm"
										onclick={() => removeIngredient(i)}
									>
										✕
									</button>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Instructions -->
				<div class="form-group">
					<label class="form-label" for="recipe-instructions">Instructions *</label>
					<textarea
						id="recipe-instructions"
						class="form-textarea"
						placeholder="Write your recipe instructions here. Each paragraph will become a step."
						bind:value={formData.strInstructions}
						rows="8"
					></textarea>
					{#if formErrors.strInstructions}
						<span class="form-error">{formErrors.strInstructions}</span>
					{/if}
				</div>

				<!-- Preview -->
				{#if formData.strMealThumb}
					<div class="form-group">
						<span class="form-label">Preview</span>
						<div class="preview-card">
							<recipe-card
								recipe-id="preview"
								recipe-title={formData.strMeal || 'Recipe Name'}
								recipe-image={formData.strMealThumb}
								recipe-category={formData.strCategory}
								recipe-area={formData.strArea}
							></recipe-card>
						</div>
					</div>
				{/if}

				<div class="form-actions">
					<button type="button" class="btn btn--secondary" onclick={() => goto(`${base}/my-recipes`)}>
						Cancel
					</button>
					<button type="submit" class="btn btn--primary">
						{isEdit ? '💾 Save Changes' : '✨ Create Recipe'}
					</button>
				</div>
			</div>
		</form>
	</div>
</section>

{#if toast}
	<div class="toast toast--{toast.type}">{toast.message}</div>
{/if}

<style>
	.recipe-form {
		padding: var(--space-xl);
		max-width: 720px;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
	}

	.form-select {
		padding: 10px 14px;
		border: 1.5px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-bg-elevated);
		color: var(--color-text);
		font-size: 0.9rem;
		outline: none;
		transition: border-color var(--transition-fast);
		width: 100%;
	}

	.form-select:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-primary-muted);
	}

	.ingredients-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.ingredients-form-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.ingredient-row {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
	}

	.ingredient-row .form-input:first-child {
		width: 35%;
		flex-shrink: 0;
	}

	.ingredient-row .form-input:nth-child(2) {
		flex: 1;
	}

	.preview-card {
		max-width: 300px;
	}

	.form-actions {
		display: flex;
		gap: var(--space-md);
		justify-content: flex-end;
		padding-top: var(--space-md);
		border-top: 1px solid var(--color-border);
	}

	@media (max-width: 640px) {
		.form-row {
			grid-template-columns: 1fr;
		}

		.ingredient-row {
			flex-wrap: wrap;
		}

		.ingredient-row .form-input:first-child {
			width: 100%;
		}
	}
</style>
