import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FADE } from '../animations/fade';
import { FocusTrapDirective } from '../focus-trap/focus-trap.directive';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'dialog[nts]',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [FADE],
})
export class DialogComponent extends FocusTrapDirective implements OnInit, OnDestroy {
  @HostBinding('@fade') fade = true;
  @Input() windowClickClose = false;
  public validated = false;
  private destroy: Subscription[] = [];
  private name = 'DIALOG';
  private windowClicks = fromEvent(this.document, 'click').pipe(
    filter(({ target }: any) => target?.nodeName === this.name),
  );
  private get scrollbarOffset(): number {
    return this._el.nativeElement.offsetWidth - this.document.body.clientWidth;
  }

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private _el: ElementRef,
    private _renderer: Renderer2,
  ) {
    super(_el, _renderer);
  }

  ngOnInit() {
    this.destroy.push(this.windowClicks.subscribe(this.close.bind(this)));
    this.document.body.style.paddingInlineEnd = `${this.scrollbarOffset}px`;
    this.document.body.style.overflow = 'hidden';
  }

  submit(event: any) {
    console.log(event);
    event.preventDefault();
    this.validated = true;
  }

  close() {
    this.router.navigate([{ outlets: { dialog: null } }]);
  }

  override ngOnDestroy() {
    this.destroy.forEach((sub) => sub.unsubscribe());
    this.document.body.style.paddingInlineEnd = '0px';
    this.document.body.style.overflow = 'initial';
  }
}
