import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tt-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-control.component.html',
  styleUrl: './rating-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingControlComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingControlComponent implements ControlValueAccessor {

  stars: number[] = [];
  rating = signal<number>(0);

  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit() {
    this.stars = Array(5).fill(0);
  }

  selectRating(value: number) {
    this.rating.set(value);
    this.onChange(value);
  }

  writeValue(value: number) {
    this.rating.set(value);
  }

  registerOnChange(fn: (value: number) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.rating.set(0);
    }
  }

}
