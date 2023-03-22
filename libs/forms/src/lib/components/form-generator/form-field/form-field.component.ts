import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Forms } from '../../../forms.model';
import { dynamicPropertyEvaluation$ } from '../../../utils/dynamic-property-evaluation.util';

@Component({
  selector: 'nts-form-field-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements OnInit, OnChanges {
  @Input() formField?: Forms.FormField | null = null;
  @Input() formGroup = new FormGroup({});
  @Input() options?: Forms.FormOptions | null = null;
  @Input() datafields?: Forms.Datafields = {};

  public visible$: Observable<boolean> = new BehaviorSubject(true);
  public disabled$: Observable<boolean> = new BehaviorSubject(false);
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formGroup'] && this.formGroup) {
      this.visible$ = dynamicPropertyEvaluation$(this.formField?.visible, this.formGroup);
      this.disabled$ = dynamicPropertyEvaluation$(this.formField?.disabled, this.formGroup, {
        // Check if the control is currently disabled and set that to the default setting
        defaultValue: this.formGroup?.get(this.formField?.field ?? '')?.disabled ?? false,
      });
    }
  }
}
