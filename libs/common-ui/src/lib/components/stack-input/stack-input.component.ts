import { Component, forwardRef, HostListener, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'tt-stack-input',
  standalone: true, 
  imports: [CommonModule, FormsModule, AsyncPipe, SvgIconComponent],
  templateUrl: './stack-input.component.html',
  styleUrl: './stack-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => StackInputComponent)
    }
  ]
})
export class StackInputComponent implements ControlValueAccessor {

  value$ = new BehaviorSubject<string[]>([]);
  #disabled = false;

  @HostListener('class.disabled')
  get disabled(): boolean {
    return this.#disabled;
  }

  innerInput = '';

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event?.stopPropagation();
    event?.preventDefault();
    
    if(!this.innerInput) return;

    this.value$.next([...this.value$.value, this.innerInput]);
    this.innerInput = '';
    this.onChange(this.value$.value)
  }

  writeValue(stack: string[] | null): void {
    if(!stack) {
      this.value$.next([]);
      return; 
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState?(isDisabled: boolean): void {
    this.#disabled = isDisabled;
  }

  onChange(value: string[] | null) {
    
  }

  onTouched() {

  }

  onTagDelete(i: number) {
    const tags = this.value$.value;
    tags.splice(i, 1);

    this.value$.next(tags);
    this.onChange(this.value$.value)
  }

}
