import { ChangeDetectionStrategy, Component, forwardRef, OnInit, Optional, Self } from '@angular/core';
import { NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NtsInputComponent } from '../input/input.component';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NtsTextComponent),
  multi: true
};

@Component({
  selector: 'nts-input-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class NtsTextComponent extends NtsInputComponent<string> implements OnInit {

  constructor(@Self() @Optional() public ngControl: NgControl) {
    super()
  }

  ngOnInit(): void {
  }

}
