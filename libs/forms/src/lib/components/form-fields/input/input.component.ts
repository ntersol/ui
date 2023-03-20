import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { startWith, debounceTime, map, distinctUntilChanged, Observable, combineLatest, of, tap } from 'rxjs';

import { Forms } from '../../../forms.model';
import { isRequired } from '../../../utils';
import { expressionReplacer$ } from '../../../utils/expression-replacer.util';
import { required } from '../../../validators/src/misc.validators';
import { validatorsAdd } from '../../../validators/validators.util';
import { BaseFormFieldComponent } from '../form-field.base';

interface InputState {
  hasData: boolean;
  showErrors: boolean;
  isValid: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  required: boolean;
  errors: any[] | null;
}

@Component({
  selector: 'cmg-clear2-ui-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InputComponent<t> extends BaseFormFieldComponent<t> implements OnInit, OnChanges, OnDestroy {
  // Dynamic content
  public label$!: Observable<string | null>;
  public prefix$!: Observable<string | null>;
  public suffix$!: Observable<string | null>;
  public hint$!: Observable<string | null>;
  // Main state entity
  public inputState$!: Observable<InputState | null>;

  /** DOM element for showing required status */
  public requiredTag = `<sup class="required">*</sup>`;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // If input control, formgroup or value changes, update state
    if (changes['formGroup'] || changes['control'] || changes['label']) {
      this.label$ = expressionReplacer$(this.formGroup, this.label);
    }
    if (changes['formGroup'] || changes['control'] || changes['prefix']) {
      this.prefix$ = expressionReplacer$(this.formGroup, this.prefix);
    }
    if (changes['formGroup'] || changes['control'] || changes['suffix']) {
      this.suffix$ = expressionReplacer$(this.formGroup, this.suffix);
    }
    if (changes['formGroup'] || changes['control'] || changes['hint']) {
      this.hint$ = expressionReplacer$(this.formGroup, this.hint);
    }

    // If input control changes, updae validators
    if ((changes['control'] || changes['validators']) && this.validators) {
      validatorsAdd(this.formControl, this.validators);
    }

    if (changes['formGroup'] || changes['control']) {
      this.inputState$ = combineLatest({
        hasData: this.formControl.valueChanges.pipe(
          tap((value) => this.onChange.emit(value)), // Emit changed value to parent through template
          startWith(this.formControl.value),
          debounceTime(1),
          map((val) => val !== null && val !== undefined && val !== ''),
          distinctUntilChanged(),
        ),
        showErrors: this.formControl.statusChanges.pipe(
          startWith(this.formControl?.status),
          debounceTime(1),
          map((x) => x === 'INVALID' && !!this.formControl?.touched),
          distinctUntilChanged(),
        ),
        isValid: this.formControl.statusChanges.pipe(
          startWith(this.formControl?.status),
          debounceTime(1),
          map((x) => x === 'VALID'),
          distinctUntilChanged(),
        ),
        isDisabled: this.formControl.statusChanges.pipe(
          startWith(this.formControl?.status),
          debounceTime(1),
          map((x) => x === 'DISABLED'),
          distinctUntilChanged(),
        ),
        isInvalid: this.formControl.statusChanges.pipe(
          startWith(this.formControl?.status),
          debounceTime(1),
          map((x) => x === 'INVALID'),
          distinctUntilChanged(),
        ),
        errors: this.formControl.statusChanges.pipe(
          startWith(this.formControl?.errors),
          debounceTime(1),
          map(() => {
            if (!this.formControl?.errors) {
              return null;
            }
            return Object.keys(this.formControl.errors).reduce(
              (a, b) => (this.formControl?.errors ? [...a, this.formControl?.errors[b]] : [...a]),
              [] as string[],
            );
          }),
        ),
        required: of(isRequired(this.formControl)),
      }).pipe(debounceTime(1));
    }
  }

  private validatorsManage(validators: Forms.Validators) {
    // console.log(this.validators);
    // console.log(this.formControl.hasValidator(required));
    Object.keys(validators).forEach((key) => {
      if (key === 'required') {
        this.formControl.addValidators(required);
      }
    });
    console.log(this.formControl.hasValidator(required));
  }
}
