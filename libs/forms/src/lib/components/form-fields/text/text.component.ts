import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent extends BaseFormFieldComponent<string> implements OnInit, AfterViewInit {
  /** The MAXIMUM number of characters allowed by this input */
  @Input() maxLength?: number | null = null;
  /** The MINIMUM number of characters allowed by this input */
  @Input() minLength?: number | null = null;

  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.input) {
      return;
    }
    if (this.minLength) {
      this.input.nativeElement.minLength = this.minLength;
    }
    if (this.maxLength) {
      this.input.nativeElement.maxLength = this.maxLength;
    }
  }
}
