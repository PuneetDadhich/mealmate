import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'tag-badge',
  styleUrl: 'tag-badge.css',
  shadow: true,
})
export class TagBadge {
  @Prop() label: string = '';
  @Prop() variant: string = 'default';
  @Prop() removable: boolean = false;
  @Prop() clickable: boolean = false;

  @Event() badgeRemoved: EventEmitter<string>;
  @Event() badgeClicked: EventEmitter<string>;

  private handleRemove(e: MouseEvent) {
    e.stopPropagation();
    this.badgeRemoved.emit(this.label);
  }

  private handleClick() {
    if (this.clickable) {
      this.badgeClicked.emit(this.label);
    }
  }

  render() {
    return (
      <span
        class={{
          'badge': true,
          [`badge--${this.variant}`]: true,
          'badge--clickable': this.clickable,
        }}
        onClick={() => this.handleClick()}
      >
        <span class="badge__label">{this.label}</span>
        {this.removable && (
          <button class="badge__remove" onClick={(e) => this.handleRemove(e)} aria-label={`Remove ${this.label}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        <slot></slot>
      </span>
    );
  }
}
