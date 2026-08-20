# MealMate — Recipe Finder & Meal Planner

- **GitHub Repository**: [https://github.com/PuneetDadhich/mealmate](https://github.com/PuneetDadhich/mealmate)
- **NPM Package (UI Library)**: [https://www.npmjs.com/package/mealmate-ui](https://www.npmjs.com/package/mealmate-ui)
- **Live Deployed App**: [https://puneetdadhich.github.io/mealmate/](https://puneetdadhich.github.io/mealmate/)

A modern Recipe Finder & Meal Planner platform built with Svelte 5, SvelteKit, and StencilJS web components.

## Project Structure

This repository is organized as a monorepo containing two main projects:

1. **`recipe-ui-components/`**: A reusable design system component library built with StencilJS.
2. **`recipe-app/`**: The frontend web application built with SvelteKit and Svelte 5, using the `mealmate-ui` package.

## Features

- **Recipe Discovery**: Search, filter by category and cuisine, and browse random recipes using TheMealDB API.
- **Recipe Details**: View full ingredients, measurements, and step-by-step instructions.
- **Favorites Management**: Save favorite recipes to local storage for quick access.
- **Weekly Meal Planner**: Assign recipes to breakfast, lunch, or dinner for any day of the week.
- **My Recipes (CRUD)**: Create, edit, and delete your own custom recipes with dynamic ingredient lists.
- **Dark & Light Mode**: Premium, fully responsive theme toggle, seamlessly integrating with both the Svelte app and the Stencil UI components via CSS custom variables.
- **Design System**: A complete custom design system with CSS custom properties, glassmorphism, and responsive layouts powered by StencilJS web components.

## Local Development

### 1. Build the Component Library

The Stencil component library must be built first so the SvelteKit app can consume it.

```bash
cd recipe-ui-components
npm install
npm run build
```

*(Note: During development, you can use `npm start` in the `recipe-ui-components` folder to run a dev server for testing components in isolation).*

### 2. Run the SvelteKit Application

```bash
cd recipe-app
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## Architecture & Technologies

- **Svelte 5**: Utilizing the new `$state` and `$derived` runes for reactive local state management (Favorites, Meal Plan, User Recipes).
- **SvelteKit**: Configured with `adapter-static` for Single Page Application (SPA) deployment. Client-side routing is fully supported.
- **StencilJS**: Used to build framework-agnostic web components (`<recipe-card>`, `<recipe-search>`, etc.). The Svelte app registers them using `defineCustomElements()`.
- **TheMealDB API**: Provides real-world recipe data (images, instructions, categories).

## Assumptions Made

- **API Scope**: Since TheMealDB API does not provide a robust built-in way to get *only* vegetarian meals alongside other filters, a custom script (`scripts/generate_recipes.js`) was created to fetch, filter (strictly vegetarian), and cache a localized list of recipes to fulfill the vegetarian requirement while still using real-world data.
- **LocalStorage Data**: It is assumed that user-specific data (favorites, meal plans, custom recipes) should persist per device, so `localStorage` was chosen as the primary database instead of setting up a complex backend.
- **Modern Browser Support**: Svelte 5 and native Web Components (Stencil) were used with the assumption that the application will be accessed on modern evergreen browsers.
- **Deployment**: The `base` path configuration in SvelteKit was assumed to be for GitHub Pages sub-folder deployment (`/mealmate/`).

## Deployment

This project is configured for automated deployment to GitHub Pages via GitHub Actions.

1. Push your code to the `main` branch.
2. The `.github/workflows/deploy.yml` action will automatically build both the Stencil library and the SvelteKit application, and publish the `build/` output to GitHub Pages.

### Setting up GitHub Pages
In your GitHub repository settings:
1. Go to **Settings > Pages**.
2. Under "Build and deployment", set the **Source** to **GitHub Actions**.

## NPM Publishing (Component Library)

To publish the `mealmate-ui` component library to NPM:

```bash
cd recipe-ui-components
npm login
npm publish --access public
```
