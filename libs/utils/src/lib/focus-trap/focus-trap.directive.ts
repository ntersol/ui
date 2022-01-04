import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ntsFocusTrap]',
})
export class FocusTrapDirective implements AfterViewInit, OnDestroy, OnChanges {
  @Input() ntsFocusTrap = false;
  @Input() selectors: string[] = ['a[href]', 'button', 'textarea', 'input', 'select'];
  private $ = this.el.nativeElement;
  private listeners: any[] = [];

  private get focus(): Node[] {
    return Array.from(this.$.querySelectorAll(this.selectors.join(', ')) as NodeList).filter(
      (el: any) => !el.disabled,
    );
  }

  private get first(): HTMLInputElement {
    return this.focus[0] as HTMLInputElement;
  }

  private get last(): HTMLInputElement {
    return this.focus[this.focus.length - 1] as HTMLInputElement;
  }

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.run();
  }

  ngOnChanges() {
    this.ngOnDestroy();
    this.run();
  }

  run() {
    if (this.first && this.ntsFocusTrap) {
      this.first.focus();
      this.listeners.push(this.renderer.listen(this.$, 'keydown', (e) => {
        if (e.keyCode !== 9) return;

        if (e.shiftKey) {
          if (document.activeElement === this.first) {
            this.last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === this.last) {
            this.first.focus();
            e.preventDefault();
          }
        }
      }));
    }
  }

  ngOnDestroy() {
    this.listeners.forEach((destroy: any) => destroy())
  }
}
