import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-input-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NtsNumberComponent extends NtsInputComponent<number> implements OnInit {

  /** The MAXIMUM number of characters allowed by this input, NOT max number */
  @Input() maxlength: number | null = null;
  /** Show or hide spinner buttons */
  @Input() showButtons = false;
  /** Min number to allow, NOT min characters */
  @Input() min: number | null = null;
  /** Max number to allow, NOT max characters */
  @Input() max: number | null = null;

  @Input() mode: 'decimal' | 'currency' = 'decimal';
  /** Use a comma to separate thousands/millions/etc */
  @Input() useGrouping = true;
  /** */
  @Input() minFractionDigits = 0;
  /** */
  @Input() maxFractionDigits = 2;

  constructor() {
    super()
  }

  ngOnInit(): void {
    // If mode is currency, allow cents
    if (this.mode === 'currency') {
      this.minFractionDigits = 2;
    }
  }

}
