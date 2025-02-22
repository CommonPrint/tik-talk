import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimeFormatPipe } from '@tt/common-ui';

@Component({
  selector: 'app-date-format',
  standalone: true,
  imports: [TimeFormatPipe],
  templateUrl: './date-format.component.html',
  styleUrl: './date-format.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateFormatComponent {
  dateFormat = input<string | null>();
}
