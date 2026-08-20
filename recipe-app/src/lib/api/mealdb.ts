import generatedRecipes from '../data/recipes.json';
import { base } from '$app/paths';

export interface MealDBRecipe {
	idMeal: string;
	strMeal: string;
	strCategory: string;
	strArea: string;
	strInstructions: string;
	strMealThumb: string;
	strTags: string | null;
	strYoutube: string | null;
	strSource: string | null;
	[key: string]: string | null;
}

export interface MealDBCategory {
	idCategory: string;
	strCategory: string;
	strCategoryThumb: string;
	strCategoryDescription: string;
}

export interface MealDBFilterResult {
	strMeal: string;
	strMealThumb: string;
	idMeal: string;
}

// Hardcoded Indian Regional Vegetarian Database
const INDIAN_VEG_RECIPES: MealDBRecipe[] = [
	{
		idMeal: '10001',
		strMeal: 'Palak Paneer',
		strCategory: 'Punjabi',
		strArea: 'Indian',
		strInstructions: '1. Boil spinach and puree it.\n2. Sauté onions, tomatoes, ginger, and garlic.\n3. Add spices (garam masala, turmeric, cumin).\n4. Mix in spinach puree and cook for 5 minutes.\n5. Add paneer cubes and a splash of cream. Serve hot.',
		strMealThumb: `${base}/images/palak_paneer.png`,
		strTags: 'Curry,Healthy',
		strYoutube: '',
		strSource: '',
		strIngredient1: 'Spinach', strMeasure1: '500g',
		strIngredient2: 'Paneer', strMeasure2: '250g',
		strIngredient3: 'Onion', strMeasure3: '2 medium',
		strIngredient4: 'Tomato', strMeasure4: '2 medium',
		strIngredient5: 'Cream', strMeasure5: '2 tbsp'
	},
	{
		idMeal: '10002',
		strMeal: 'Chana Masala',
		strCategory: 'Punjabi',
		strArea: 'Indian',
		strInstructions: '1. Soak chickpeas overnight and boil until tender.\n2. Fry onions, tomatoes, and green chilies.\n3. Add chana masala powder, turmeric, and coriander.\n4. Add boiled chickpeas and simmer for 15 minutes.\n5. Garnish with fresh cilantro.',
		strMealThumb: `${base}/images/chana_masala.png`,
		strTags: 'Spicy,Vegan',
		strYoutube: '',
		strSource: '',
		strIngredient1: 'Chickpeas', strMeasure1: '2 cups',
		strIngredient2: 'Onion', strMeasure2: '1 large',
		strIngredient3: 'Tomato', strMeasure3: '2 large',
		strIngredient4: 'Chana Masala', strMeasure4: '2 tbsp',
		strIngredient5: 'Cilantro', strMeasure5: 'For garnish'
	},
	{
		idMeal: '10003',
		strMeal: 'Dal Makhani',
		strCategory: 'Punjabi',
		strArea: 'Indian',
		strInstructions: '1. Soak whole black lentils and kidney beans overnight. Boil until soft.\n2. Sauté onion, garlic, and tomato puree in butter.\n3. Add spices and cooked lentils.\n4. Simmer on low heat for at least 1 hour for rich flavor.\n5. Finish with fresh cream and butter.',
		strMealThumb: `${base}/images/dal_makhani.png`,
		strTags: 'Rich,Lentils',
		strYoutube: '',
		strSource: '',
		strIngredient1: 'Black Lentils (Urad Dal)', strMeasure1: '1 cup',
		strIngredient2: 'Kidney Beans (Rajma)', strMeasure2: '1/4 cup',
		strIngredient3: 'Butter', strMeasure3: '4 tbsp',
		strIngredient4: 'Cream', strMeasure4: '1/4 cup',
		strIngredient5: 'Tomato Puree', strMeasure5: '1 cup'
	},
	{
		idMeal: '10004',
		strMeal: 'Masala Dosa',
		strCategory: 'South Indian',
		strArea: 'Indian',
		strInstructions: '1. Soak rice and urad dal overnight, grind into a smooth batter and ferment.\n2. Boil and mash potatoes, sauté with mustard seeds, curry leaves, onions, and turmeric for the filling.\n3. Spread a thin layer of batter on a hot griddle.\n4. Add oil/butter around the edges and cook until crispy.\n5. Place potato filling inside and fold. Serve with sambar and chutney.',
		strMealThumb: `${base}/images/masala_dosa.png`,
		strTags: 'Crispy,Breakfast',
		strYoutube: '',
		strSource: '',
		strIngredient1: 'Dosa Batter', strMeasure1: '2 cups',
		strIngredient2: 'Potatoes', strMeasure2: '3 large',
		strIngredient3: 'Onion', strMeasure3: '1 large',
		strIngredient4: 'Mustard Seeds', strMeasure4: '1 tsp',
		strIngredient5: 'Curry Leaves', strMeasure5: '1 sprig'
	},
	{
		idMeal: '10005',
		strMeal: 'Idli Sambar',
		strCategory: 'South Indian',
		strArea: 'Indian',
		strInstructions: '1. Steam fermented rice and lentil batter in idli molds until fluffy.\n2. Boil toor dal (pigeon peas) with vegetables like carrots, drumsticks, and pumpkin.\n3. Prepare a tempering of mustard seeds, dry red chilies, and curry leaves.\n4. Add tamarind extract and sambar powder to the boiling dal.\n5. Serve hot idlis submerged in flavorful sambar.',
		strMealThumb: `${base}/images/idli_sambar.png`,
		strTags: 'Healthy,Breakfast',
		strYoutube: '',
		strSource: '',
		strIngredient1: 'Idli Batter', strMeasure1: '2 cups',
		strIngredient2: 'Toor Dal', strMeasure2: '1 cup',
		strIngredient3: 'Mixed Vegetables', strMeasure3: '1 cup',
		strIngredient4: 'Sambar Powder', strMeasure4: '2 tbsp',
		strIngredient5: 'Tamarind Extract', strMeasure5: '2 tbsp'
	},
	{
		idMeal: '10006',
		strMeal: 'Dal Bati Churma',
		strCategory: 'Rajasthani',
		strArea: 'Indian',
		strInstructions: '1. Prepare a dough from whole wheat flour, ghee, and milk. Form into round balls (Batis).\n2. Bake the Batis in an oven or tandoor until golden and cooked through.\n3. Prepare a mixed lentil dal (Panchmel Dal) tempered with ghee, cumin, and red chilies.\n4. Crush a few baked batis, mix with ghee and jaggery/sugar to make sweet Churma.\n5. Serve hot Batis dipped in ghee alongside the dal and churma.',
		strMealThumb: `${base}/images/cat_rajasthani.png`,
		strTags: 'Rich,Traditional',
		strYoutube: '',
		strSource: '',
		strIngredient1: 'Whole Wheat Flour', strMeasure1: '2 cups',
		strIngredient2: 'Ghee', strMeasure2: '1/2 cup',
		strIngredient3: 'Mixed Lentils', strMeasure3: '1 cup',
		strIngredient4: 'Jaggery', strMeasure4: '1/2 cup',
		strIngredient5: 'Cumin', strMeasure5: '1 tsp'
	},
	{
		idMeal: '10007',
		strMeal: 'Gatte Ki Sabzi',
		strCategory: 'Rajasthani',
		strArea: 'Indian',
		strInstructions: '1. Knead a dough using besan (gram flour), yogurt, and spices. Roll into cylindrical logs.\n2. Boil the logs in water until they float, then cut them into small round pieces (Gatte).\n3. Prepare a spicy yogurt-based gravy with cumin, coriander, and red chili powder.\n4. Add the boiled gatte to the simmering gravy.\n5. Garnish with fresh coriander and serve with roti or rice.',
		strMealThumb: `${base}/images/gatte_ki_sabzi.png`,
		strTags: 'Spicy,Curry',
		strYoutube: '',
		strSource: '',
		strIngredient1: 'Gram Flour (Besan)', strMeasure1: '1.5 cups',
		strIngredient2: 'Yogurt', strMeasure2: '1 cup',
		strIngredient3: 'Coriander Powder', strMeasure3: '2 tsp',
		strIngredient4: 'Red Chili Powder', strMeasure4: '1 tsp',
		strIngredient5: 'Oil', strMeasure5: '3 tbsp'
	},
	{
		idMeal: '10008',
		strMeal: 'Vegetable Biryani',
		strCategory: 'North Indian',
		strArea: 'Indian',
		strInstructions: '1. Marinate mixed vegetables in yogurt (or vegan yogurt) and biryani masala.\n2. Partially cook basmati rice with whole spices.\n3. Layer the vegetables and rice in a heavy-bottomed pot.\n4. Add saffron milk and mint leaves on top.\n5. Cook on dum (low heat with a sealed lid) for 20 minutes.',
		strMealThumb: `${base}/images/vegetable_biryani.png`,
		strTags: 'Rice,Spicy',
		strYoutube: '',
		strSource: '',
		strIngredient1: 'Basmati Rice', strMeasure1: '2 cups',
		strIngredient2: 'Mixed Vegetables', strMeasure2: '2 cups',
		strIngredient3: 'Biryani Masala', strMeasure3: '2 tbsp',
		strIngredient4: 'Mint Leaves', strMeasure4: '1/2 cup',
		strIngredient5: 'Saffron', strMeasure5: 'a pinch'
	},
	...(generatedRecipes as MealDBRecipe[])
];

export async function searchRecipes(query: string): Promise<MealDBRecipe[]> {
	if (!query) return INDIAN_VEG_RECIPES;
	const q = query.toLowerCase();
	return INDIAN_VEG_RECIPES.filter(r => r.strMeal.toLowerCase().includes(q));
}

export async function getRecipeById(id: string): Promise<MealDBRecipe | null> {
	return INDIAN_VEG_RECIPES.find(r => r.idMeal === id) || null;
}

export async function getRandomRecipe(): Promise<MealDBRecipe | null> {
	const index = Math.floor(Math.random() * INDIAN_VEG_RECIPES.length);
	return INDIAN_VEG_RECIPES[index];
}

export async function getRandomRecipes(count: number = 8): Promise<MealDBRecipe[]> {
	// Shuffle and return count
	const shuffled = [...INDIAN_VEG_RECIPES].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

export async function filterByCategory(category: string): Promise<MealDBFilterResult[]> {
	const filtered = INDIAN_VEG_RECIPES.filter(r => r.strCategory.toLowerCase() === category.toLowerCase());
	return filtered.map(r => ({
		idMeal: r.idMeal,
		strMeal: r.strMeal,
		strMealThumb: r.strMealThumb
	}));
}

export async function filterByArea(area: string): Promise<MealDBFilterResult[]> {
	const filtered = INDIAN_VEG_RECIPES.filter(r => r.strArea.toLowerCase() === area.toLowerCase());
	return filtered.map(r => ({
		idMeal: r.idMeal,
		strMeal: r.strMeal,
		strMealThumb: r.strMealThumb
	}));
}

export async function getCategories(): Promise<MealDBCategory[]> {
	// Extract unique categories from both hardcoded and generated
	const uniqueCats = new Set<string>();
	INDIAN_VEG_RECIPES.forEach(r => uniqueCats.add(r.strCategory));
	
	let i = 1;
	return Array.from(uniqueCats).map(cat => {
		const firstRecipe = INDIAN_VEG_RECIPES.find(r => r.strCategory === cat);
		return {
			idCategory: (i++).toString(),
			strCategory: cat,
			strCategoryThumb: firstRecipe ? firstRecipe.strMealThumb : '',
			strCategoryDescription: `${cat} Cuisine`
		};
	});
}

export async function getCategoryNames(): Promise<string[]> {
	const uniqueCats = new Set<string>();
	INDIAN_VEG_RECIPES.forEach(r => uniqueCats.add(r.strCategory));
	return Array.from(uniqueCats);
}

export async function getAreaNames(): Promise<string[]> {
	const uniqueAreas = new Set<string>();
	INDIAN_VEG_RECIPES.forEach(r => uniqueAreas.add(r.strArea));
	return Array.from(uniqueAreas);
}

export async function listByFirstLetter(letter: string): Promise<MealDBRecipe[]> {
	const l = letter.toLowerCase();
	return INDIAN_VEG_RECIPES.filter(r => r.strMeal.toLowerCase().startsWith(l));
}

export function extractIngredients(recipe: MealDBRecipe): { ingredient: string; measure: string }[] {
	const ingredients: { ingredient: string; measure: string }[] = [];
	for (let i = 1; i <= 20; i++) {
		const ingredient = recipe[`strIngredient${i}`];
		const measure = recipe[`strMeasure${i}`];
		if (ingredient && ingredient.trim()) {
			ingredients.push({
				ingredient: ingredient.trim(),
				measure: measure?.trim() || ''
			});
		}
	}
	return ingredients;
}
