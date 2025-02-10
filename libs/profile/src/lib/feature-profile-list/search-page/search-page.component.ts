import { Component, inject } from '@angular/core';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component';
import { Store } from '@ngrx/store';
import { profileActions, selectFilteredProfiles } from '../../data';
import { InfiniteScrollTriggerComponent } from "../../../../../common-ui/src/lib/components/infinite-scroll-trigger/infinite-scroll-trigger.component";
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    ProfileCardComponent, 
    ProfileFiltersComponent, 
    InfiniteScrollTriggerComponent,
    InfiniteScrollDirective
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);

  console = console

  constructor() {}

  timeToFetch() {
    this.store.dispatch(profileActions.setPage({}))
  }

  onScroll() {
    this.timeToFetch();
  }

  onIntersection(entries: IntersectionObserverEntry[]) {

    if(!entries.length) return

    if(entries[0].intersectionRatio > 0) {
      this.timeToFetch();
    }
  }

}
