import { Component, input } from '@angular/core';
import { TimeFormatPipe } from '../../helpers/pipes/time-format.pipe';

@Component({
  selector: 'app-date-format',
  standalone: true,
  imports: [TimeFormatPipe],
  templateUrl: './date-format.component.html',
  styleUrl: './date-format.component.scss',
})
export class DateFormatComponent {
  dateFormat = input<string | null>();
}
