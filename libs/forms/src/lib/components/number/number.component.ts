import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NtsInputComponent } from '../input/input.component';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NtsNumberComponent),
  multi: true
};

@Component({
  selector: 'nts-number',
  templateUrl: './number.component.html',
  styleUrls: ['../input/input.component.scss', './number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class NtsNumberComponent extends NtsInputComponent<number> implements OnInit {

  @Input() mode: 'decimal' | 'currency' = 'decimal';
  @Input() useGrouping = true;
  @Input() minFractionDigits = 0;
  @Input() maxFractionDigits = 2;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() disabled = false


  constructor() {
    super()
  }

  ngOnInit(): void { }
}
