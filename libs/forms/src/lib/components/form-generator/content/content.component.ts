import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NtsForms } from '../../../forms.model';
import { is } from '../../../utils';

@Component({
  selector: 'nts-form-field-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  @Input() content?: NtsForms.Content | null = null;
  @Input() formGroup = new FormGroup({});
  @Input() options?: NtsForms.FormOptions | null = null;
  /** Datafields for dynamic data */
  @Input() datafields?: NtsForms.Datafields | null = {};

  public is = is;
  constructor() {}

  ngOnInit(): void {}
}
