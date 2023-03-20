import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent extends BaseFormFieldComponent<string> implements OnInit {
  /** # of vertical rows  */
  @Input() rows = 4;
  /** Max # of characters  */
  @Input() maxlength?: number | null = null;
  /** # of horizontal columns  */
  @Input() columns?: number | null = null;

  /**  */
  @Input() autoResize = false;

  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
