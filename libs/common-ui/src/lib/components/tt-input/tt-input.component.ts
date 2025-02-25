import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ControlValueAccessor, FormsModule, 
  NG_VALUE_ACCESSOR, ReactiveFormsModule 
} from '@angular/forms';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';


@Component({
  selector: 'tt-input',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    SvgIconComponent
  ],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtInputComponent),
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TtInputComponent implements ControlValueAccessor {
  
  type = input<'text' | 'password'>('text');
  localType: string = '';

  placeholder = input<string>();

  onChange: any;
  onTouched: any;
  disabled = signal<boolean>(false);

  value: string | null = null

  writeValue(val: string | null): void {
    this.value = val
  }

  registerOnChange(fn: any): void {
    this.onChange = fn 
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    console.log(isDisabled);
  }

  ngOnInit() {
    this.localType = this.type() || 'text';
  }

  onModelChange(val: string | null): void {
    this.onChange(val);
  }

  togglePasswordVisibility(newType: string): void {
    this.localType = newType;
  }

}
