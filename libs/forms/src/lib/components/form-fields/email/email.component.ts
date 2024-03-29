import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseFormFieldComponent } from '../form-field.base';

@Component({
  selector: 'nts-form-field-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailComponent extends BaseFormFieldComponent<string> implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
