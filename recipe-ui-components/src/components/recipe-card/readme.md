# recipe-card



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type      | Default |
| ---------------- | ----------------- | ----------- | --------- | ------- |
| `compact`        | `compact`         |             | `boolean` | `false` |
| `isFavorite`     | `is-favorite`     |             | `boolean` | `false` |
| `recipeArea`     | `recipe-area`     |             | `string`  | `''`    |
| `recipeCategory` | `recipe-category` |             | `string`  | `''`    |
| `recipeId`       | `recipe-id`       |             | `string`  | `''`    |
| `recipeImage`    | `recipe-image`    |             | `string`  | `''`    |
| `recipeTitle`    | `recipe-title`    |             | `string`  | `''`    |


## Events

| Event             | Description | Type                                                |
| ----------------- | ----------- | --------------------------------------------------- |
| `cardClicked`     |             | `CustomEvent<{ id: string; }>`                      |
| `favoriteToggled` |             | `CustomEvent<{ id: string; isFavorite: boolean; }>` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
