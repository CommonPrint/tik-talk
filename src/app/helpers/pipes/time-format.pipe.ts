import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: string | null): string | null {
    if(!value) return null;
    
    const date = new Date(value);

    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
  }

}
