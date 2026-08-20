import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';

@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true,
})
export class RecipeCard {
  @Prop() recipeId: string = '';
  @Prop() recipeTitle: string = '';
  @Prop() recipeImage: string = '';
  @Prop() recipeCategory: string = '';
  @Prop() recipeArea: string = '';
  @Prop() isFavorite: boolean = false;
  @Prop() compact: boolean = false;

  @State() imageLoaded: boolean = false;
  @State() imageError: boolean = false;

  @Event() favoriteToggled: EventEmitter<{ id: string; isFavorite: boolean }>;
  @Event() cardClicked: EventEmitter<{ id: string }>;

  private handleFavoriteClick(e: MouseEvent) {
    e.stopPropagation();
    this.favoriteToggled.emit({ id: this.recipeId, isFavorite: !this.isFavorite });
  }

  private handleCardClick() {
    this.cardClicked.emit({ id: this.recipeId });
  }

  private handleImageLoad() {
    this.imageLoaded = true;
  }

  private handleImageError() {
    this.imageError = true;
    this.imageLoaded = true;
  }

  render() {
    return (
      <div
        class={{
          'card': true,
          'card--compact': this.compact,
        }}
        onClick={() => this.handleCardClick()}
      >
        <div class="card__image-wrapper">
          {!this.imageLoaded && (
            <div class="card__skeleton">
              <div class="card__skeleton-shimmer"></div>
            </div>
          )}
          {!this.imageError ? (
            <img
              class={{ 'card__image': true, 'card__image--loaded': this.imageLoaded }}
              src={this.recipeImage}
              alt={this.recipeTitle}
              loading="lazy"
              onLoad={() => this.handleImageLoad()}
              onError={() => this.handleImageError()}
            />
          ) : (
            <div class="card__image-fallback">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM3 20c0-3.5 3.5-6 9-6s9 2.5 9 6" stroke-linecap="round"/>
              </svg>
              <span>No Image</span>
            </div>
          )}
          <button
            class={{ 'card__favorite': true, 'card__favorite--active': this.isFavorite }}
            onClick={(e) => this.handleFavoriteClick(e)}
            aria-label={this.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg viewBox="0 0 24 24" fill={this.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {this.recipeCategory && (
            <span class="card__badge card__badge--category">{this.recipeCategory}</span>
          )}
        </div>
        <div class="card__content">
          <h3 class="card__title">{this.recipeTitle}</h3>
          {this.recipeArea && (
            <span class="card__area">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {this.recipeArea}
            </span>
          )}
          <slot></slot>
        </div>
      </div>
    );
  }
}
