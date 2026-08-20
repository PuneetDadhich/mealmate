import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';

@Component({
  tag: 'recipe-search',
  styleUrl: 'recipe-search.css',
  shadow: true,
})
export class RecipeSearch {
  @Prop() placeholder: string = 'Search recipes...';
  @Prop() value: string = '';
  @Prop() areas: string = '[]';
  @Prop() selectedArea: string = '';

  @State() internalValue: string = '';
  @State() isFocused: boolean = false;

  @Event() searchChanged: EventEmitter<string>;
  @Event() areaChanged: EventEmitter<string>;
  @Event() searchSubmitted: EventEmitter<string>;

  private debounceTimer: any;

  componentWillLoad() {
    this.internalValue = this.value;
  }

  private handleInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.internalValue = val;
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchChanged.emit(val);
    }, 300);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      clearTimeout(this.debounceTimer);
      this.searchChanged.emit(this.internalValue);
      this.searchSubmitted.emit(this.internalValue);
    }
  }

  private handleClear() {
    this.internalValue = '';
    this.searchChanged.emit('');
  }

  private handleAreaChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.areaChanged.emit(val);
  }

  private parseJSON(str: string): string[] {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  }

  render() {
    const areaList = this.parseJSON(this.areas);

    return (
      <div class={{ 'search': true, 'search--focused': this.isFocused }}>
        <div class="search__input-wrapper">
          <svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            class="search__input"
            placeholder={this.placeholder}
            value={this.internalValue}
            onInput={(e) => this.handleInput(e)}
            onKeyDown={(e) => this.handleKeyDown(e)}
            onFocus={() => (this.isFocused = true)}
            onBlur={() => (this.isFocused = false)}
          />
          {this.internalValue && (
            <button class="search__clear" onClick={() => this.handleClear()} aria-label="Clear search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {(areaList.length > 0) && (
          <div class="search__filters">
            {areaList.length > 0 && (
              <div class="search__filter-group">
                <select
                  class="search__select"
                  onChange={(e) => this.handleAreaChange(e)}
                >
                  <option value="">All Cuisines</option>
                  {areaList.map((area) => (
                    <option value={area} selected={area === this.selectedArea}>
                      {area}
                    </option>
                  ))}
                </select>
                <svg class="search__select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
