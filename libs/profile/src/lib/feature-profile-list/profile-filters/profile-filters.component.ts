import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  filter,
  first,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { ProfileService } from '@tt/profile';
import { Store } from '@ngrx/store';
import { profileActions, selectFilterValues, setFilterValues} from '../../data';
import { ProfileFilter } from '@tt/interfaces/profile';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {

  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  store = inject(Store);

  formValue: ProfileFilter = {
    firstName: '',
    lastName: '',
    stack: '',
  }

  searchForm = this.fb.group(this.formValue);

  searchFormSub!: Subscription;


  constructor() {

    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        // Очищает от утечки памяти
        takeUntilDestroyed(),
      )
      .subscribe(formValue => {
        this.store.dispatch(setFilterValues({filters: formValue}))
      });

    this.store.select(selectFilterValues).subscribe((filters) => {
      this.searchForm.patchValue(filters, {emitEvent: false})
      this.store.dispatch(profileActions.filterEvents({filters}));
    })
  }

  ngOnDestroy(): void {
    this.searchFormSub.unsubscribe();
  }

}
