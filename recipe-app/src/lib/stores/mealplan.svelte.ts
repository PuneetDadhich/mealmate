import { browser } from '$app/environment';

export interface PlannedMeal {
	recipeId: string;
	recipeName: string;
	recipeImage: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type DayOfWeek =
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday'
	| 'Sunday';

export type DayPlan = Partial<Record<MealType, PlannedMeal>>;
export type WeekPlan = Record<DayOfWeek, DayPlan>;

export const DAYS: DayOfWeek[] = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
];
export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

const STORAGE_KEY = 'mealmate-mealplan';

function createEmptyWeek(): WeekPlan {
	const plan = {} as WeekPlan;
	for (const day of DAYS) {
		plan[day] = {};
	}
	return plan;
}

function loadPlan(): WeekPlan {
	if (!browser) return createEmptyWeek();
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : createEmptyWeek();
	} catch {
		return createEmptyWeek();
	}
}

function savePlan(plan: WeekPlan) {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

let mealPlan = $state<WeekPlan>(loadPlan());

export function getMealPlan(): WeekPlan {
	return mealPlan;
}

export function assignMeal(day: DayOfWeek, mealType: MealType, meal: PlannedMeal) {
	mealPlan = {
		...mealPlan,
		[day]: {
			...mealPlan[day],
			[mealType]: meal
		}
	};
	savePlan(mealPlan);
}

export function removeMeal(day: DayOfWeek, mealType: MealType) {
	const dayPlan = { ...mealPlan[day] };
	delete dayPlan[mealType];
	mealPlan = {
		...mealPlan,
		[day]: dayPlan
	};
	savePlan(mealPlan);
}

export function clearDay(day: DayOfWeek) {
	mealPlan = {
		...mealPlan,
		[day]: {}
	};
	savePlan(mealPlan);
}

export function clearWeek() {
	mealPlan = createEmptyWeek();
	savePlan(mealPlan);
}

export function getPlannedMealCount(): number {
	let count = 0;
	for (const day of DAYS) {
		for (const mealType of MEAL_TYPES) {
			if (mealPlan[day][mealType]) count++;
		}
	}
	return count;
}
