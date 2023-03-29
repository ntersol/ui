import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { NtsForms } from '../../../forms.model';
import { is } from '../../../utils';
import { dynamicPropertyEvaluation$ } from '../../../utils/dynamic-property-evaluation.util';

@Component({
  selector: 'nts-form-field-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements OnInit, OnChanges {
  @Input() formField?: NtsForms.FormField | null = null;
  @Input() formGroup = new FormGroup({});
  @Input() options?: NtsForms.FormOptions | null = null;
  /** Datafields for dynamic data */
  @Input() datafields?: NtsForms.Datafields | null = {};

  public visible$: Observable<boolean> = new BehaviorSubject(true);
  public disabled$: Observable<boolean> = new BehaviorSubject(false);
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Only update observable if visible is present
    if (changes['formGroup'] && this.formGroup && is.notNill(this.formField?.visible)) {
      this.visible$ = dynamicPropertyEvaluation$(this.formField?.visible, this.formGroup);
    }

    // Only update observable if disabled is present
    if (changes['formGroup'] && this.formGroup && is.notNill(this.formField?.disabled)) {
      this.disabled$ = dynamicPropertyEvaluation$(this.formField?.disabled, this.formGroup, {
        // Check if the control is currently disabled and set that to the default setting
        defaultValue: this.formGroup?.get(this.formField?.field ?? '')?.disabled ?? false,
      });
    }
  }
}
