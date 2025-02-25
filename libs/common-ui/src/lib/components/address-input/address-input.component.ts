import { ChangeDetectionStrategy, Component, forwardRef, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TtInputComponent } from "../tt-input/tt-input.component";
import { debounceTime, switchMap, tap } from 'rxjs';
import {DadataService, DadataSuggestion} from '@tt/data-access';

@Component({
  selector: 'tt-address-input',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    TtInputComponent,
    AsyncPipe
  ],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressInputComponent implements ControlValueAccessor {

  innerSearchControl = new FormControl();
  #dadataService = inject(DadataService);

  isDropdownOpened = signal<boolean>(true);
  
  address = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl('')
  })

  suggestions$ = this.innerSearchControl.valueChanges
    .pipe(
      debounceTime(500),
      switchMap(val => {
        return this.#dadataService.getSuggestion(val)
          .pipe(
            tap(res => {
              this.isDropdownOpened.set(!!res.length)
            })
          )
      })
    )

  
  writeValue(value: any): void {
    console.log('value: ', value);
    if(value) {
      this.address.patchValue(value, {emitEvent: false})
    }
  }

  setDisabledState(isDisabled: boolean): void {
  }

  onChange(value: any): void {}

  onTouched(): void {}
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  onSuggestionPick(suggest: DadataSuggestion) {
    this.isDropdownOpened.set(false);

    console.log('suggest: ', suggest.data);

    this.address.patchValue({
      city: suggest.data.city,
      street: suggest.data.street, 
      building: suggest.data.house
    })

    // Уведомляем о новых данных
    this.onChange(this.address.value);
  }

  ngOnInit() {
    this.address.valueChanges.subscribe(value => {
      this.onChange(value);
    });
  }

}
