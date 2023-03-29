import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { take, timer } from 'rxjs';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-phonenumber',
  templateUrl: './phonenumber.component.html',
  styleUrls: ['./phonenumber.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PhonenumberComponent extends BaseFormFieldComponent<string> implements OnInit {
  /** Should form controls with input masks return the raw data or the masksed/formatted data? */
  @Input() unmask = true;
  constructor() {
    super();
  }

  ngOnInit(): void {}

  /**
   * When an input mask control is selected, always move the cursor to the first available position
   * This resolves an issue where clicking on the field would move the cursor to the last position in the input
   * @param field - Reference to component
   * @param cursorPos - Position to place the cursor at
   */
  public cursorPositionSet(field: any, cursorPos = 0) {
    const val = this.formControl.value;
    const compRef = field.el.nativeElement.children[0];
    // Make sure an reference to the input was found and has the setSelectionRange available
    // Check if form control is null or empty string
    if (compRef && compRef.setSelectionRange && (val === null || val === '')) {
      // timer(1,1).pipe(take(1)).subscribe(() => compRef.setSelectionRange(cursorPos, cursorPos));
      timer(25, 1)
        .pipe(take(1))
        .subscribe(() => compRef.setSelectionRange(cursorPos, cursorPos));
      timer(250, 1)
        .pipe(take(1))
        .subscribe(() => compRef.setSelectionRange(cursorPos, cursorPos));
      // Set selection range twice, one at 25ms and one at 100ms
      // This prevents a FOUC with the 25 since the 25 doesn't always set the range so the 100 ensure it's set correctly
      // setTimeout(() => compRef.setSelectionRange(cursorPos, cursorPos), 25);
      // setTimeout(() => compRef.setSelectionRange(cursorPos, cursorPos), 100);
    }
  }
}
