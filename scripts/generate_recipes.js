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
  console.log('Fetching all recipes from TheMealDB (A-Z)...');
  let allMeals = [];
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  for (const letter of alphabet) {
    const res = await fetchJson(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    if (res && res.meals) {
      allMeals = allMeals.concat(res.meals);
    }
    await delay(100); // respect rate limits
  }

  // Remove duplicates
  const uniqueMeals = [];
  const seen = new Set();
  for (const meal of allMeals) {
    if (!seen.has(meal.idMeal)) {
      seen.add(meal.idMeal);
      uniqueMeals.push(meal);
    }
  }

  console.log(`Found ${uniqueMeals.length} total unique meals in the entire database. Filtering for Vegetarian...`);
  
  const recipes = [];
  
  // Non-veg categories
  const nonVegCategories = ['Beef', 'Chicken', 'Lamb', 'Pork', 'Seafood', 'Goat'];
  
  // Non-veg regex with word boundaries to prevent matching 'eggplant' with 'egg'
  const nonVegRegex = /\b(eggs?|chicken|beef|pork|lamb|fish|meat|stock|broth|prawns?|shrimp|bacon|ham|salmon|tuna|cod|sausage|prosciutto|anchov(y|ies)|oyster|crab|lobster|veal|venison|duck|turkey|chorizo|pancetta|salami|pepperoni|gelatin|scallops?|mussels?|clams?|squid|calamari|haddock|tilapia|trout|mackerel)\b/i;

  uniqueMeals.forEach(r => {
    r.strTags = r.strTags || '';
    r.strYoutube = r.strYoutube || '';
    r.strSource = r.strSource || '';
    r.strArea = (r.strArea && r.strArea !== 'Unknown') ? r.strArea : 'International';
    
    // Normalize typo from TheMealDB database
    if (r.strArea === 'India') {
      r.strArea = 'Indian';
    }

    let isNonVeg = false;
    
    // Check Category first
    if (nonVegCategories.includes(r.strCategory)) {
      isNonVeg = true;
    }

    // Check ingredients
    if (!isNonVeg) {
      for (let j = 1; j <= 20; j++) {
        const ingredient = (r[`strIngredient${j}`] || '');
        if (nonVegRegex.test(ingredient)) {
          isNonVeg = true;
          break;
        }
      }
    }

    // Check recipe title for sneaky meats
    if (!isNonVeg && nonVegRegex.test(r.strMeal)) {
      isNonVeg = true;
    }

    if (!isNonVeg) {
      // Re-categorize the generic "Vegetarian" and "Vegan" categories so they are more descriptive
      if (r.strCategory === 'Vegetarian' || r.strCategory === 'Vegan') {
          r.strCategory = 'Main Course';
      }
      recipes.push(r);
    }
  });

  const dir = path.join(__dirname, '../recipe-app/src/lib/data');
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(path.join(dir, 'recipes.json'), JSON.stringify(recipes, null, 2));
  console.log(`Successfully generated ${recipes.length} STRICTLY vegetarian recipes from the entire database!`);
})();
