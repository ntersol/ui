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
  @Input() scrollHeight = '200px';

  /** Style of the dropdown panel */
  @Input() panelStyle = '';
  /** Css class */
  @Input() panelStyleClass = '';


  public get optionsMapped() {
    return [{ label: '-- Please Select --', value: null, styleClass: 'color:#666666', style: 'color:#666666', disabled: true }, ...this.options];
  }

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
