import { ChangeDetectionStrategy, Component, Input, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { NtsInputComponent } from '../input/input.component';

@Component({
  selector: 'nts-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NtsDropdownComponent extends NtsInputComponent<any[]> implements OnInit {

  @Input() options: SelectItem[] = [];
  @Input() optionLabel = 'label';
  @Input() optionValue = 'value';
  @Input() optionDisabled = 'disabled';
  @Input() scrollHeight = '200px';
  /** Append popup to this DOM element, can use "body" or another template variable */
  @Input() appendTo: any = null;
  /** Use virtual scroll to handle a large list */
  @Input() virtualScroll = false;
  /** Show an "X" which lets the user clear this value */
  @Input() showClear = false;

  @Input() placeholder = '-- Please Select --';

  /** Style of the dropdown panel */
  @Input() panelStyle = '';
  /** Css class */
  @Input() panelStyleClass = '';

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
