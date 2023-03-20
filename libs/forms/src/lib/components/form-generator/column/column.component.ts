import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Forms } from '../../../forms.model';

@Component({
  selector: 'cmg-clear2-ui-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent implements OnInit {
  @Input() column?: Forms.Column<unknown> | null = null;
  @Input() formGroup?: FormGroup | null = null;
  @Input() options?: Forms.FormOptions | null = null;
  @Input() datafields: Forms.Datafields = {};

  constructor() {}

  ngOnInit(): void {}
}
