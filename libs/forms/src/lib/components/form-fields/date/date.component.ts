import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { debounceTime, filter, startWith } from 'rxjs';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'cmg-clear2-ui-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DateComponent extends BaseFormFieldComponent<string> implements OnInit, OnChanges {
  /** Standard html placeholder text */
  @Input() override placeholder = 'mm/dd/yyyy';
  @Input() inline = false;
  @Input() showIcon = true;
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
            startWith(this.formControl.getRawValue()),
            filter((x) => typeof x === 'string'),
            debounceTime(1)
          )
          .subscribe((x) => this.formControl.patchValue(new Date(x)))
      );
    }
  }
}
