import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Inject,
  PLATFORM_ID,
  EventEmitter,
  Output,
} from '@angular/core';
import { MediaBreakpoints } from './visible.models';
import { mediaQueries } from './breakpoints.utils';
import { isVisible, breakpointsToBootStrapClasses } from './visible.utils';
import { fromEvent, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

/**
 * Shows/hides elements in the DOM based on responsive breakpoints. Will fall back to bootstrap display utilities
 * if the browser or it's dependencies are not available
 * USAGE: <div visible="sm md lg"></div> OR <div visible="md-up"></div>
 */
@Component({
  selector: '[visible]',
  templateUrl: './visible.component.html',
  styleUrls: ['./visible.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisibleComponent implements OnInit {
  @Input() visible?: MediaBreakpoints = 'all';

  @Output() isVisible = new EventEmitter<boolean>();
  /** Check for browser and matchMedia present */
  public isBrowser = isPlatformBrowser(this.platformId) && typeof matchMedia !== 'undefined';
  /** Show or hide this content based on the visible properties and media query selection */
  public show$ = this.isBrowser
    ? fromEvent(window, 'resize').pipe(
        startWith(0),
        debounceTime(50),
        map(() => isVisible(this.visible || 'all', mediaQueries)),
        distinctUntilChanged(),
        tap((x) => this.isVisible.emit(x)),
      )
    : of(true);

  /** Holds fallback bootstrap classes to support SSR */
  public bootstrapClasses = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.bootstrapClasses = breakpointsToBootStrapClasses(this.visible);
  }
}
