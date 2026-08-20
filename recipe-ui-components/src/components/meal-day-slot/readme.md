# meal-day-slot



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type      | Default |
| ------------- | -------------- | ----------- | --------- | ------- |
| `dayName`     | `day-name`     |             | `string`  | `''`    |
| `isEmpty`     | `is-empty`     |             | `boolean` | `true`  |
| `mealType`    | `meal-type`    |             | `string`  | `''`    |
| `recipeId`    | `recipe-id`    |             | `string`  | `''`    |
| `recipeImage` | `recipe-image` |             | `string`  | `''`    |
| `recipeName`  | `recipe-name`  |             | `string`  | `''`    |


## Events

| Event         | Description | Type                                              |
| ------------- | ----------- | ------------------------------------------------- |
| `mealRemoved` |             | `CustomEvent<{ day: string; mealType: string; }>` |
| `slotClicked` |             | `CustomEvent<{ day: string; mealType: string; }>` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
