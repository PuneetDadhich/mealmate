import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';

@Component({
  tag: 'star-rating',
  styleUrl: 'star-rating.css',
  shadow: true,
})
export class StarRating {
  @Prop() rating: number = 0;
  @Prop() maxStars: number = 5;
  @Prop() readonly: boolean = false;
  @Prop() size: string = 'md';

  @State() hoverRating: number = 0;

  @Event() ratingChanged: EventEmitter<number>;

  private handleClick(star: number) {
    if (this.readonly) return;
    this.ratingChanged.emit(star);
  }

  private handleMouseEnter(star: number) {
    if (this.readonly) return;
    this.hoverRating = star;
  }

  private handleMouseLeave() {
    if (this.readonly) return;
    this.hoverRating = 0;
  }

  render() {
    const stars = [];
    const displayRating = this.hoverRating || this.rating;

    for (let i = 1; i <= this.maxStars; i++) {
      const filled = i <= Math.floor(displayRating);
      const halfFilled = !filled && i - 0.5 <= displayRating;

      stars.push(
        <span
          class={{
            'star': true,
            'star--filled': filled,
            'star--half': halfFilled,
            'star--interactive': !this.readonly,
          }}
          onClick={() => this.handleClick(i)}
          onMouseEnter={() => this.handleMouseEnter(i)}
          onMouseLeave={() => this.handleMouseLeave()}
        >
          <svg viewBox="0 0 24 24" fill={filled || halfFilled ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </span>
      );
    }

    return (
      <div class={{ 'rating': true, [`rating--${this.size}`]: true, 'rating--readonly': this.readonly }}>
        {stars}
      </div>
    );
  }
}
