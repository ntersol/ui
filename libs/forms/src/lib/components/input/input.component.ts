import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'nts-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsInputComponent<t> implements OnInit, OnDestroy {
  /** Standard html placeholder text */
  @Input() placeholder: string | null = null;
  /** Floating label that appears in front of the content and moves above it when focused */
  @Input() label: string | null = null;
  /** Allow hover functionality */
  @Input() hover = true;

  /** Text to use for ID attribute */
  @Input() id = '';
  /** Text to use for name attribute */
  @Input() name = '';
  /** Any css classes */
  @Input() styleClass = '';
  /** Enable/disable this control, uses the form controls status */
  @Input() set disabled(v: boolean | null) {
    if (!!this.control && v !== null) {
      !v ? this.control.enable() : this.control.disable();
    }
  }
  get disabled(): boolean {
    return !!this.control?.enabled ?? false;
  }

  /** An icon of text that will appear BEFORE the input */
  @Input() prefix: string | null = null;
  /** An icon of text that will appear AFTER the input */
  @Input() suffix: string | null = null;
  /** Small text that appears beneath the control */
  @Input() hint: string | null = null;
  /** Is this contorl focosued */
  @Input() focused = false;

  // Can't use 'formControl' directly, it's defined incorrectly in the Angular definitions and can't be overriden without a lot of hacky stuff
  // See https://medium.com/youngers-consulting/angular-typed-reactive-forms-22842eb8a181
  // @Input() formControl?: AbstractControl | null = null;
  get formControl(): FormControl {
    return !!this.control ? this.control as FormControl : new FormControl();
  }
  @Input() control?: AbstractControl | null = null;

  /** When the input is focused */
  @Output() onFocus = new EventEmitter();
  /** When the input is blurred */
  @Output() onBlur = new EventEmitter();
  @Output() onChange = new EventEmitter<t>();
  /** On keyup event on the input */
  @Output() onKeyup = new EventEmitter<KeyboardEvent>();

  constructor() { }

  ngOnInit(): void {
    // Emit changes to onChange event emitter
    this.control?.valueChanges.pipe(untilDestroyed(this)).subscribe(v => this.onChange.emit(v))
  }


  blur() {
    this.focused = false;
    this.onBlur.emit();
  }

  focus() {
    this.focused = true;
    this.onFocus.emit();
  }

  ngOnDestroy(): void { }

}
