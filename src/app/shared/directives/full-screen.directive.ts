import { Directive, ElementRef, AfterViewInit, OnChanges, HostBinding, Input } from '@angular/core';

type overflow = 'auto' | 'hidden' | 'inherit' | 'initial' | 'overlay' | 'scroll' | 'visible';

/**
 * Resizes the attached DOM element to full all vertical space below it's current position
 */
@Directive({
  selector: '[appFullScreen]',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class FullScreenDirective implements AfterViewInit, OnChanges {

  /** DOM reference */
  public elem: ElementRef;
  /** Current height of element */
  public height: number;

  /** How much to offset the bottom of the grid. Helpful to accomodate for a horizontal scrollbar */
  @Input() offset: number = 21;
  /** How to handle overflow Y */
  @Input() overflowY: overflow = 'auto';
  /** How to handle overflow X */
  @Input() overflowX: overflow = 'hidden';

  constructor(
    el: ElementRef
  ) {
    this.elem = el;
  }

  /**
   * Refresh the height manually
   */
  public refresh() {
    this.calcHeight();
  }

  /**
   * On any input changes, refresh height
   */
  ngOnChanges() {
    this.calcHeight();
  }

  /**
   * After view is available, refresh height
   */
  ngAfterViewInit() {
    this.calcHeight();
  }

  private calcHeight() {
    // Make sure DOM is ready
    if (this.elem && this.elem.nativeElement) {
      let offsetTop = Math.round(this.elem.nativeElement.getBoundingClientRect().top + this.offset);
      this.elem.nativeElement.style['height'] = 'calc(100vh - ' + offsetTop + 'px)';
      this.elem.nativeElement.style['overflow-y'] = this.overflowY;
      this.elem.nativeElement.style['overflow-x'] = this.overflowX;
      this.height = Math.floor(this.elem.nativeElement.getBoundingClientRect().height);
    }
  }

  /**
   * On window resize, wrap in setTimeout to ensure resize already happened
   */
  private onResize() {
    setTimeout(() => {
      this.calcHeight();
    },100);
  }

}
//let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
