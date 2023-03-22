import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Forms } from '../../forms.model';
import { is } from '../../utils';

/**
 * TODO:
 * - Possible issue with required fields and dynamic visibility. IE required field is shown then hidden
 * - SSR support
 */

@Component({
  selector: 'nts-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormGeneratorComponent implements OnInit {
  @Input() formModel?: Forms.Form<unknown> | null = [];
  /** Main form group */
  @Input() formGroup: FormGroup | null = null;
  /** Form Options */
  @Input() options?: Forms.FormOptions | null = null;
  /** Datafields for dynamic data */
  @Input() datafields?: Forms.Datafields = {};
  /** Disable submit button */
  @Input() disableSubmit = false;
  /** When the use submis */
  @Output() completed = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /**
   * On form submit, run validation
   * @returns
   */
  public submit() {
    if (is.node || !this.formGroup) {
      return;
    }
    this.formGroup.patchValue(this.formGroup.value);
    this.formGroup.markAllAsTouched();
    if (this.formGroup?.invalid) {
      // Wait for DOM to update with new validation states
      setTimeout(() => {
        // Get all errors on page
        const errors = document.getElementsByClassName('nts-form-field-has-errors');
        if (errors?.length) {
          // Get top of first error bounding box, scroll to the top of that box
          const y = errors[0].getBoundingClientRect().top + window.pageYOffset + (this.options?.errorScrollOffset ?? 0);
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    this.completed.emit(this.formGroup.getRawValue());
  }
}
