import { browser } from '$app/environment';

export interface UserRecipe {
	id: string;
	strMeal: string;
	strCategory: string;
	strArea: string;
	strInstructions: string;
	strMealThumb: string;
	strTags: string;
	ingredients: { ingredient: string; measure: string }[];
	createdAt: string;
	updatedAt: string;
}

export interface RecipeFormErrors {
	strMeal?: string;
	strCategory?: string;
	strInstructions?: string;
	ingredients?: string;
}

const STORAGE_KEY = 'mealmate-user-recipes';

function loadRecipes(): UserRecipe[] {
	if (!browser) return [];
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
}

function saveRecipes(recipes: UserRecipe[]) {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function generateId(): string {
	return 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

let userRecipes = $state<UserRecipe[]>(loadRecipes());

export function getUserRecipes(): UserRecipe[] {
	return userRecipes;
}

export function getUserRecipeById(id: string): UserRecipe | undefined {
	return userRecipes.find((r) => r.id === id);
}

export function validateRecipe(
	recipe: Partial<UserRecipe>
): { valid: boolean; errors: RecipeFormErrors } {
	const errors: RecipeFormErrors = {};

	if (!recipe.strMeal?.trim()) {
		errors.strMeal = 'Recipe name is required';
	}
	if (!recipe.strCategory?.trim()) {
		errors.strCategory = 'Category is required';
	}
	if (!recipe.strInstructions?.trim()) {
		errors.strInstructions = 'Instructions are required';
	}
	if (!recipe.ingredients || recipe.ingredients.length === 0) {
		errors.ingredients = 'At least one ingredient is required';
	} else if (recipe.ingredients.some((i) => !i.ingredient.trim())) {
		errors.ingredients = 'All ingredients must have a name';
	}

	return { valid: Object.keys(errors).length === 0, errors };
}

export function addUserRecipe(recipe: Omit<UserRecipe, 'id' | 'createdAt' | 'updatedAt'>): string {
	const id = generateId();
	const now = new Date().toISOString();
	const newRecipe: UserRecipe = {
		...recipe,
		id,
		createdAt: now,
		updatedAt: now
	};
	userRecipes = [...userRecipes, newRecipe];
	saveRecipes(userRecipes);
	return id;
}

export function updateUserRecipe(id: string, updates: Partial<UserRecipe>) {
	userRecipes = userRecipes.map((r) =>
		r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
	);
	saveRecipes(userRecipes);
}

export function deleteUserRecipe(id: string) {
	userRecipes = userRecipes.filter((r) => r.id !== id);
	saveRecipes(userRecipes);
}

export function getUserRecipeCount(): number {
	return userRecipes.length;
}
