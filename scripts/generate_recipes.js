const fs = require('fs');
const path = require('path');
const https = require('https');

const fetchJson = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

(async () => {
  console.log('Fetching list of Vegetarian meals...');
  const vegRes = await fetchJson('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian');
  
  console.log('Fetching list of Vegan meals...');
  const veganRes = await fetchJson('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegan');

  let allMeals = [];
  if (vegRes && vegRes.meals) allMeals = allMeals.concat(vegRes.meals);
  if (veganRes && veganRes.meals) allMeals = allMeals.concat(veganRes.meals);

  // Remove duplicates
  const uniqueMeals = [];
  const seen = new Set();
  for (const meal of allMeals) {
    if (!seen.has(meal.idMeal)) {
      seen.add(meal.idMeal);
      uniqueMeals.push(meal);
    }
  }

  console.log(`Found ${uniqueMeals.length} unique meals. Fetching details...`);
  
  const recipes = [];
  // Process in batches of 5 to avoid overwhelming the API
  for (let i = 0; i < uniqueMeals.length; i += 5) {
    const batch = uniqueMeals.slice(i, i + 5);
    const promises = batch.map(async (m) => {
      const details = await fetchJson(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`);
      if (details && details.meals && details.meals.length > 0) {
        return details.meals[0];
      }
      return null;
    });

    const results = await Promise.all(promises);
    results.forEach(r => {
      if (r) {
        // Ensure properties exist to match MealDBRecipe interface
        r.strTags = r.strTags || '';
        r.strYoutube = r.strYoutube || '';
        r.strSource = r.strSource || '';
        // Handle missing cuisines
        r.strArea = (r.strArea && r.strArea !== 'Unknown') ? r.strArea : 'Global';

        // Check for non-veg ingredients or eggs (strict vegetarian)
        let isNonVeg = false;
        const nonVegKeywords = ['egg', 'chicken', 'beef', 'pork', 'lamb', 'fish', 'meat', 'stock', 'broth', 'prawn', 'shrimp', 'bacon', 'ham'];
        
        for (let i = 1; i <= 20; i++) {
          const ingredient = (r[`strIngredient${i}`] || '').toLowerCase();
          if (nonVegKeywords.some(kw => ingredient.includes(kw))) {
            isNonVeg = true;
            break;
          }
        }

        // Remove global recipes and any recipe containing non-veg items
        if (r.strArea === 'Global' || isNonVeg) {
          return; // Skip this recipe
        }

        // Since all recipes are vegetarian/vegan, make the Category equal to the Cuisine (Area)
        if (r.strCategory === 'Vegetarian' || r.strCategory === 'Vegan') {
            r.strCategory = r.strArea;
        }
        recipes.push(r);
      }
    });

    console.log(`Fetched details for ${recipes.length}/${uniqueMeals.length} recipes...`);
    await delay(100);
  }

  const dir = path.join(__dirname, '../recipe-app/src/lib/data');
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(path.join(dir, 'recipes.json'), JSON.stringify(recipes, null, 2));
  console.log('Successfully imported real recipes with exact images from TheMealDB.');
})();
