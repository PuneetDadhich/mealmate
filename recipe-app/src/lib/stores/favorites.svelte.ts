import { browser } from '$app/environment';
import type { MealDBRecipe } from '$lib/api/mealdb';

const STORAGE_KEY = 'mealmate-favorites';

function loadFavorites(): MealDBRecipe[] {
	if (!browser) return [];
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
}

function saveFavorites(favs: MealDBRecipe[]) {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

let favorites = $state<MealDBRecipe[]>(loadFavorites());

export function getFavorites(): MealDBRecipe[] {
	return favorites;
}

export function isFavorite(id: string): boolean {
	return favorites.some((f) => f.idMeal === id);
}

export function addFavorite(recipe: MealDBRecipe) {
	if (!isFavorite(recipe.idMeal)) {
		favorites = [...favorites, recipe];
		saveFavorites(favorites);
	}
}

export function removeFavorite(id: string) {
	favorites = favorites.filter((f) => f.idMeal !== id);
	saveFavorites(favorites);
}

export function toggleFavorite(recipe: MealDBRecipe) {
	if (isFavorite(recipe.idMeal)) {
		removeFavorite(recipe.idMeal);
	} else {
		addFavorite(recipe);
	}
}

export function getFavoriteCount(): number {
	return favorites.length;
}
