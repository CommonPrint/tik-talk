import { RouterLink } from '@angular/router';
import { Component, inject, Injector, OnDestroy, runInInjectionContext } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BehaviorSubject, catchError, combineLatest, concat, debounceTime, delay, distinctUntilChanged, filter, find, first, forkJoin, from, fromEvent, interval, map, merge, Observable, of, pairwise, race, retry, scan, skip, Subject, Subscription, switchMap, take, takeUntil, tap, throwError, timer, withLatestFrom, zip } from 'rxjs';
import { DestroyService } from './destroy.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tt-experimental',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.scss',
  providers: [DestroyService]
})
export class ExperimentalComponent {
  
  subNumber = 0;

  state: Record<string, number[]> = {};

  subscriptions: Subscription = new Subscription();

  destroy$ = inject(DestroyService);

  injector = inject(Injector);

  constructor() {
    // timer(0, 100)
    //   .pipe(
    //     map(val => {
    //       return factorialize(val * 10)
    //     }),
    //     scan((acc, curr) => {
    //       return acc + curr
    //     }, 0),
    //     takeUntilDestroyed()
    //   )
    //   .subscribe(() => {
    //     console.log(111);
    //   });
  }

  addSub() {
    this.subNumber += 1;
    this.state[this.subNumber + ''] = [];

    runInInjectionContext(this.injector, () => {
      timer(0, 100)
      .pipe(
        map(val => {
          return factorialize(val * 10)
        }),
        scan((acc, curr) => {
          return acc + curr
        }, 0),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        console.log(111);
      });
    })
    
  }

}

function factorialize(num: number): number {
  if (num < 0) return 0;
  if (num === 0) return 1;
  return num * factorialize(num - 1);
}

