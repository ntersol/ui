import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NtsInputComponent } from '../input/input.component';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NtsNumberComponent),
  multi: true
};

@Component({
  selector: 'nts-number',
  templateUrl: '../input/input.component.html',
  styleUrls: ['./number.component.scss', '../input/input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class NtsNumberComponent extends NtsInputComponent<number> implements OnInit {

  @Input() decimalPlaces: number | null = 2;

  public type = 'number';

  constructor() {
    super()
  }

  ngOnInit(): void { }

  //Get accessor
  get value(): number | null {
    console.log(1, this.innerValue)
    return this.innerValue;
  };

  //Set accessor including call the onchange callback
  set value(v: number | null) {
    if (v !== this.innerValue) {
      this.innerValue = this.numberFormat(v);
      this.onChangeCallback(this.innerValue);
    }
  }

  /**
   *
   * @param v
   * @returns
   */
  private numberFormat(v: number | null) {

    if (v === null) {
      return null;
    }
    let num = Number(v);

    if (this.decimalPlaces !== null) {
      num = Number(num.toFixed(this.decimalPlaces));
    }
    console.log(num)
    return num;
  }

}
