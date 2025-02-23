import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { 
  FormBuilder, FormControl, FormArray, 
  FormGroup, ReactiveFormsModule, Validators,
  FormRecord, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MockService, Feature} from "../experimental/mock.service";
import {NameValidator} from './name.validator';

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL'
}

interface Address {
  city?: string;
  street?: string;
  building?: number;
  apartment?: number;
}


function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
  })
}


function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.startsWith(forbiddenLetter)
    ? {startsWith: {message: `${forbiddenLetter} - ты нашел меня!`}}
    : null
  }
}


function validateDateRange({fromControlName, toControlName}: {fromControlName: string, toControlName: string}): ValidatorFn {
  return (control: AbstractControl) => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);

    if(!fromControl || !toControl) {
      return null;
    }

    const fromDate = new Date(fromControl.value);
    const toDate = new Date(toControl.value);

    if(fromDate && toDate && fromDate > toDate) {
      toControl.setErrors({dateRange: {message: 'Дата начала позже даты окончания'}});
      return toControl.errors;
    }

    return null;
  }
}


@Component({
  selector: 'tt-forms-experiment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss'
})
export class FormsExperimentComponent {

  ReceiverType = ReceiverType;

  mockService = inject(MockService);
  nameValidator = inject(NameValidator);

  features: Feature[] = [];

  // В FormGroup в отличии от FormBuilder.group() мы можем вставлять функции
  // например, ниже для поля [address] мы вставили функцию getAddressForm()
  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    inn: new FormControl<string>(''),
    name: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
      updateOn: 'blur'
    }),
    lastName: new FormControl<string>(''),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup({
      from: new FormControl<string>(''),
      to: new FormControl<string>(''),
    })
  }, validateDateRange({fromControlName: 'from', toControlName: 'to'}));

  constructor() {

    this.mockService.getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe(addrs => {
        while(this.form.controls.addresses.controls.length > 0) {
          this.form.controls.addresses.removeAt(0);
        }

        this.form.controls.addresses.clear();

        for(const addr of addrs) {
          this.form.controls.addresses.push(getAddressForm(addr));
        }

        // this.form.controls.addresses.setValue(addrs);
        // this.form.controls.addresses.setControl(1, getAddressForm(addrs[0]));
        // console.log(this.form.controls.addresses.at(0));
      });

    this.mockService.getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;

        for(const feature of features) {
          this.form.controls.feature.addControl(
            feature.code, 
            new FormControl(feature.value)
          );
        }
      })

    // valueChanges - реагирует на изменения внутри формы
    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((val) => {
        // Очистка от валидаторов
        this.form.controls.inn.clearValidators();

        if(val === ReceiverType.LEGAL) {
          this.form.controls.inn.setValidators(
            [Validators.required, Validators.minLength(10), Validators.maxLength(12)]
          );
        }
      });
  }

  onSubmit(event: SubmitEvent) {
    console.log(this.form.valid);
    console.log(this.form.value);
  }

  addAddress() {
    this.form.controls.addresses.insert(0, getAddressForm());
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index);
  }

  // sort нужен для [keyvalue] в HTML-коде
  sort = () => 0

}