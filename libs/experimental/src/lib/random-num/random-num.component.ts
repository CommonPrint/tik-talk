import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, timer } from 'rxjs';

@Component({
  selector: 'tt-random-num',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './random-num.component.html',
  styleUrl: './random-num.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandomNumComponent implements DoCheck {
  @Input() random = Math.random();

  random$ = timer(0, 1000).pipe(
    map(() => Math.random())
  )

  get random2() {
    return Math.random();
  }


  cdr = inject(ChangeDetectorRef);

  ngDoCheck() {
    console.log('DO CHECK');
  }

  constructor() {

    // setInterval(() => {
    //   this.random = Math.random();
      
    //   console.log(this.random);
    // }, 1000);
  }
}
