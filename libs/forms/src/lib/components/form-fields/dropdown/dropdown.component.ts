import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Forms } from '../../../forms.model';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent extends BaseFormFieldComponent<string> implements OnInit, OnChanges {
  /** Options to display for the dropdown */
  @Input() options?: Forms.FieldOptions[] | null = null;
  /** A unique ID used for  trackFn */
  @Input() dataKey?: string | null = null;
  /** The property for the label */
  @Input() optionLabel = 'label';
  /** The property for the value */
  @Input() optionValue = 'value';
  /** Name of the disabled field of an option. */
  @Input() optionDisabled = 'disabled';
  /** The default height of the dropdown */
  @Input() scrollHeight?: string | null = '200px';
  /** Append popup to this DOM element, can use "body" or another template variable */
  @Input() appendTo: any = null;
  /** Use virtual scroll to handle a large list */
  @Input() virtualScroll?: boolean | null = false;
  /** Show an "X" which lets the user clear this value */
  @Input() showClear?: boolean | null = false;
  /** If true, inserts an empty option with the label of the placeholder and a value of null at the top of the list. Essentially a selectable null option  */
  @Input() insertEmptyOption?: boolean | null = false;

  @Input() override placeholder = '-- Please Select --';

  /** Style of the dropdown panel */
  @Input() panelStyle = '';
  /** Css class */
  @Input() panelStyleClass = '';

  // Add in empty option if selected
  public optionsUpdated?: Forms.FieldOptions[] | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // If insertEmptyOption is set, append that option to the options array
    if (changes['options'] || changes['insertEmptyOption']) {
      this.optionsUpdated =
        this.insertEmptyOption && this.options
          ? [{ label: this.placeholder || '', value: null }, ...this.options]
          : this.options;
    }
  }
}
