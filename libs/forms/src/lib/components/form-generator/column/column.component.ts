import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NtsForms } from '../../../forms.model';
import { is } from '../../../utils';

@Component({
  selector: 'nts-form-field-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent implements OnInit {
  @Input() column?: NtsForms.Column | null = null;
  @Input() formGroup = new FormGroup({});
  @Input() options?: NtsForms.FormOptions | null = null;
  /** Datafields for dynamic data */
  @Input() datafields?: NtsForms.Datafields | null = {};

  public is = is;

  constructor() {}

  ngOnInit(): void {}
}
