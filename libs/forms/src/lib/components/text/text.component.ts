import { ChangeDetectionStrategy, Component, Input, OnInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-input-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsTextComponent extends NtsInputComponent<string> implements OnInit {

  /** The MAXIMUM number of characters allowed by this input */
  @Input() maxlength: number | null = null;
  /** The MINIMUM number of characters allowed by this input */
  @Input() minlength: number | null = null;

  constructor(
    @Self()
    @Optional()
    private ngControl?: NgControl,
  ) {
    super()
    // This is required to successfully implement ControlValueAccessor and
    // also be able to reference ngControl within the template
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.ngControl?.control) {
      this.control = this.ngControl?.control;
    }

  }



}
