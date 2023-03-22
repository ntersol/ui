import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Forms } from '../../../forms.model';
import { is } from '../../../utils';

@Component({
  selector: 'nts-form-field-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  @Input() content?: Forms.Content<unknown> | null = null;
  @Input() formGroup = new FormGroup({});
  @Input() options?: Forms.FormOptions | null = null;
  @Input() datafields?: Forms.Datafields = {};

  public is = is;
  constructor() {}

  ngOnInit(): void {}
}
