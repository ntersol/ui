import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { debounceTime, filter, startWith } from 'rxjs';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DateComponent extends BaseFormFieldComponent<string> implements OnInit, OnChanges, OnDestroy {
  /** Standard html placeholder text */
  @Input() override placeholder?: string | null = 'mm/dd/yyyy';
  /** When enabled, displays the calendar as inline. Default is false for popup mode. */
  @Input() inline?: boolean | null = false;
  /** Show the calendar icon on the input */
  @Input() showIcon?: boolean | null = true;
  /** Format of the date which can also be defined at locale settings. */
  @Input() dateFormat?: string | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // If input control changes
    if (changes['control']) {
      // Clean up any existing subs
      this.subs.forEach((s) => s.unsubscribe());
      this.subs = [];
      this.subs.push(
        // Watch for form control changes, if input type is string convert to date
        // NgPrime date control requires a date type
        this.formControl.valueChanges
          .pipe(
            startWith(this.formControl.value),
            filter((x) => !!x && typeof x === 'string'),
            debounceTime(1),
          )
          .subscribe((x) => this.formControl.patchValue(new Date(x))),
      );
    }
  }

  // Base class unsubs in ondestroy
  // ngOnDestroy(): void {   }
}
