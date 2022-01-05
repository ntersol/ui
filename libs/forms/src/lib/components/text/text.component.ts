import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-input-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NtsTextComponent),
    }
  ]
})
export class NtsTextComponent extends NtsInputComponent<string> implements OnInit {

  /** The MAXIMUM number of characters allowed by this input */
  @Input() maxlength: number | null = null;
  /** The MINIMUM number of characters allowed by this input */
  @Input() minlength: number | null = null;

  constructor() {
    super()
  }

  ngOnInit(): void {
  }



}
