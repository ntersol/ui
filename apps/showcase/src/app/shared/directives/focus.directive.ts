import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';

/**
 * When this element is loaded, automatically attach focus
 * USAGE:
 * ntsFocus
 * [ntsFocus]="false" // Disable
 */
@Directive({
  selector: '[ntsFocus]',
})
export class FocusDirective implements AfterViewInit {
  /** Default should focus on load, can be set to false to disable */
  @Input() ntsFocus: boolean | undefined;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    if (this.ntsFocus !== false && this.el && this.el.nativeElement) {
      setTimeout(() => this.el.nativeElement.focus(), 500);
    }
  }
}
