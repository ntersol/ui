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
  @Input() content?: Forms.Content | null = null;
  @Input() formGroup = new FormGroup({});
  @Input() options?: Forms.FormOptions | null = null;
  /** Datafields for dynamic data */
  @Input() datafields?: Forms.Datafields | null = {};

  public is = is;
  constructor() {}

  ngOnInit(): void {}
}
