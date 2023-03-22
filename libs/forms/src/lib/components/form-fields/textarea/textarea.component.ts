import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent extends BaseFormFieldComponent<string> implements OnInit {
  /** The number of rows (vertical) displayed in the textarea  */
  @Input() rows?: number | null = 4;
  /** The maximum number of characters allowed in the textarea. If null, there is no maximum limit  */
  @Input() maxlength?: number | null = null;
  /** The number of columns (horizontal) displayed in the textarea */
  @Input() columns?: number | null = null;
  /** When present, textarea size changes as being typed */
  @Input() autoResize?: boolean | null = false;

  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
