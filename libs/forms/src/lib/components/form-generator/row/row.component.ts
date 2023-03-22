import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Forms } from '../../../forms.model';
import { dynamicPropertyEvaluation$ } from '../../../utils/dynamic-property-evaluation.util';

@Component({
  selector: 'nts-form-field-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowComponent implements OnInit, OnChanges {
  @Input() row?: Forms.Row | null = null;
  @Input() formGroup = new FormGroup({});
  @Input() options?: Forms.FormOptions | null = null;
  @Input() datafields?: Forms.Datafields = {};

  public visible$!: Observable<boolean>;
  public visibleColumns: Observable<boolean>[] = [];
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formGroup'] && this.formGroup) {
      this.visible$ = dynamicPropertyEvaluation$(this.row?.visible, this.formGroup);
      this.visibleColumns = this.row
        ? this.row.columns.map((c) => dynamicPropertyEvaluation$(c.visible, this.formGroup))
        : [];
    }
  }
}
