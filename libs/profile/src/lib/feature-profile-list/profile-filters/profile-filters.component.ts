import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProfileService } from '@tt/profile';
import { Store } from '@ngrx/store';
import { profileActions } from '../../data';

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

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

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
        this.store.dispatch(profileActions.filterEvents({filters: formValue}));
      });
  }

  ngOnDestroy(): void {
    this.searchFormSub.unsubscribe();
  }
}
