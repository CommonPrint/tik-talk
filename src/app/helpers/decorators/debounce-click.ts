import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export function DebounceClick(time: number) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const subject = new Subject();

    // Переопределяем метод
    descriptor.value = function (...args: any[]) {
      // Привязка контекста this внутри декоратора
      subject.pipe(debounceTime(time)).subscribe(() => {
        originalMethod.apply(this, args);
      });

      subject.next(args);
    };

    return descriptor;
  };
}
