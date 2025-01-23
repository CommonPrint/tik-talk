import { Directive, ElementRef, inject } from "@angular/core";
import { COLOR } from "../post/color.token";

@Directive({
    selector: '[test]',
    standalone: true
})
export class TestDirective {
    elRef = inject(ElementRef);
    color = inject(COLOR);

    constructor() {
        console.log(this.color);
        this.elRef.nativeElement.style.border = `10px solid ${this.color[0]}`;
    }
}