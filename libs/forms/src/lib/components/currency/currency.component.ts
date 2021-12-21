import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NtsInputComponent } from '../input/input.component';
import { NtsNumberComponent } from '../number/number.component';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NtsNumberComponent),
  multi: true
};

@Component({
  selector: 'nts-input-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class NtsCurrencyComponent extends NtsInputComponent<number> implements OnInit {

  @Input() disabled = false

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
