import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'meal-day-slot',
  styleUrl: 'meal-day-slot.css',
  shadow: true,
})
export class MealDaySlot {
  @Prop() dayName: string = '';
  @Prop() mealType: string = '';
  @Prop() recipeName: string = '';
  @Prop() recipeImage: string = '';
  @Prop() recipeId: string = '';
  @Prop() isEmpty: boolean = true;

  @Event() mealRemoved: EventEmitter<{ day: string; mealType: string }>;
  @Event() slotClicked: EventEmitter<{ day: string; mealType: string }>;

  private getMealIcon(): string {
    switch (this.mealType.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  }

  private handleRemove(e: MouseEvent) {
    e.stopPropagation();
    this.mealRemoved.emit({ day: this.dayName, mealType: this.mealType });
  }

  private handleSlotClick() {
    this.slotClicked.emit({ day: this.dayName, mealType: this.mealType });
  }

  render() {
    const empty = this.isEmpty || !this.recipeName;

    return (
      <div
        class={{ 'slot': true, 'slot--empty': empty, 'slot--filled': !empty }}
        onClick={() => this.handleSlotClick()}
      >
        <div class="slot__header">
          <span class="slot__meal-icon">{this.getMealIcon()}</span>
          <span class="slot__meal-type">{this.mealType}</span>
        </div>
        {empty ? (
          <div class="slot__empty-state">
            <div class="slot__add-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <span class="slot__empty-text">Add meal</span>
          </div>
        ) : (
          <div class="slot__filled-state">
            {this.recipeImage && (
              <img class="slot__recipe-image" src={this.recipeImage} alt={this.recipeName} loading="lazy" />
            )}
            <span class="slot__recipe-name">{this.recipeName}</span>
            <button class="slot__remove" onClick={(e) => this.handleRemove(e)} aria-label="Remove meal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <slot></slot>
      </div>
    );
  }
}
