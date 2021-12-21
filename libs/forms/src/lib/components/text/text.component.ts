import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NtsInputComponent } from '../input/input.component';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NtsTextComponent),
  multi: true
};

@Component({
  selector: 'nts-text',
  templateUrl: './text.component.html',
  styleUrls: ['../input/input.component.scss', './text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class NtsTextComponent extends NtsInputComponent<string> implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
