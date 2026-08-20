# MealMate UI Components

![NPM Version](https://img.shields.io/npm/v/mealmate-ui)
![License](https://img.shields.io/npm/l/mealmate-ui)

- **NPM Package**: [https://www.npmjs.com/package/mealmate-ui](https://www.npmjs.com/package/mealmate-ui)
- **GitHub Repository**: [https://github.com/PuneetDadhich/mealmate](https://github.com/PuneetDadhich/mealmate)

**MealMate UI** is a beautifully crafted, standalone Web Component library designed specifically for recipe, food, and meal-planning applications. Built with [StencilJS](https://stenciljs.com/), these components are blazing fast, highly customizable, and completely framework-agnostic—meaning you can use them seamlessly in Svelte, React, Vue, Angular, or plain HTML.

## 📦 Installation

To use this component library in your project, install it via NPM:

```bash
npm install mealmate-ui
```

## 🚀 Getting Started

### Using with SvelteKit (or other modern frameworks)
In your main layout file or entry point (e.g., `+layout.svelte` or `index.js`), import and call the component loader:

```javascript
import { defineCustomElements } from 'mealmate-ui/loader';

// Register the custom elements with the browser
defineCustomElements();
```

### Using via CDN (Plain HTML)
If you prefer not to use a bundler, you can drop a script tag directly into your HTML file:

```html
<script type="module" src="https://unpkg.com/mealmate-ui/dist/mealmate-ui/mealmate-ui.esm.js"></script>
```

## 🧩 Available Components

### `<recipe-card>`
A beautiful, responsive card for displaying recipe thumbnails, titles, and categories. Includes built-in support for favoriting recipes.
```html
<recipe-card 
  recipe-title="Delicious Pasta"
  recipe-category="Italian"
  recipe-image="https://example.com/pasta.jpg"
  is-favorite="true">
</recipe-card>
```

### `<recipe-search>`
A fully-featured search bar with integrated dropdown filters for categories and cuisines.
```html
<recipe-search 
  placeholder="Search recipes..."
  categories='["Breakfast", "Dessert", "Pasta"]'
  selected-category="Pasta">
</recipe-search>
```

### `<meal-day-slot>`
A specialized interactive slot component used for meal planners to drop or assign recipes to specific times of day.
```html
<meal-day-slot 
  day-name="Monday" 
  meal-type="Breakfast" 
  is-empty="false" 
  recipe-name="Oatmeal">
</meal-day-slot>
```

### `<tag-badge>`
A small, stylized badge component for displaying categories, dietary requirements, or tags.
```html
<tag-badge label="Vegan" variant="category"></tag-badge>
```

## 🎨 Customization (CSS Variables)

MealMate UI uses CSS Custom Properties (Variables) for easy theming. You can override the default colors and sizing by targeting the components in your global CSS:

```css
:root {
  --mealmate-bg: #1e1e2e;
  --mealmate-text-primary: #ffffff;
  --mealmate-accent: #f59e0b; /* Orange/Amber */
  --mealmate-card-radius: 12px;
}
```

## 📄 License
This project is licensed under the MIT License.