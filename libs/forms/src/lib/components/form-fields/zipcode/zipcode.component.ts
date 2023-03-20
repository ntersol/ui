import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'cmg-clear2-ui-zipcode',
  templateUrl: './zipcode.component.html',
  styleUrls: ['./zipcode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZipcodeComponent extends BaseFormFieldComponent<string> implements OnInit, OnChanges {
  @Input() dataType?: 'string' | 'number' | null;
  @Input() allowNineDigitCodes?: boolean | null;

  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']) {
      // Unsub existing subs
      this.subs.forEach((s) => s.unsubscribe());

      // When internal zip control changes
      this.subs.push(
        this.formControl.valueChanges.subscribe((zip) => {
          if (zip === null) {
            return;
          }
          // Remove non numeric chars
          let zipNew = zip.replace(/[^\d.]/gi, '');
          // If a 6th char is added, put a hyphen between them. This will also remove hyphen if only 5 chars
          if (zipNew.length >= 6) {
            zipNew = zipNew.slice(0, 5) + '-' + zipNew.slice(5);
          }
          // Convert data type to number of requested and not a nine digit code
          // The hyphen is required in the 9 digit code
          zipNew = this.dataType === 'number' && !this.allowNineDigitCodes ? parseInt(zipNew) : String(zipNew);
          // Patch data back into the control
          this.formControl.patchValue(zipNew, { emitEvent: false });
        }),
      );
    }
  }
}
