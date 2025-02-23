import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomNumComponent } from "../random-num/random-num.component";

@Component({
  selector: 'tt-experimental',
  standalone: true,
  imports: [CommonModule, RandomNumComponent],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.scss',
})
export class ExperimentalComponent {
  
  random = Math.random();
  ngZone = inject(NgZone);

  constructor() {
    // setTimeout(() => { 
    //   this.random = 111
    // }, 3000)
  }

}
