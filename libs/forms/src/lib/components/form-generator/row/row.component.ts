import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { NtsForms } from '../../../forms.model';
import { is } from '../../../utils';
import { dynamicPropertyEvaluation$ } from '../../../utils/dynamic-property-evaluation.util';

@Component({
  selector: 'nts-form-field-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowComponent implements OnInit, OnChanges {
  @Input() row?: NtsForms.Row | null = null;
  @Input() formGroup = new FormGroup({});
  @Input() options?: NtsForms.FormOptions | null = null;
  /** Datafields for dynamic data */
  @Input() datafields?: NtsForms.Datafields | null = {};

  public visible$: Observable<boolean> = new BehaviorSubject(true);
  public visibleColumns: Observable<boolean>[] = [];
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Only update observable if visible is present
    if (changes['formGroup'] && this.formGroup && is.notNill(this.row?.visible)) {
      this.visible$ = dynamicPropertyEvaluation$(this.row?.visible, this.formGroup);
    }
    if (changes['formGroup'] && this.formGroup) {
      this.visibleColumns = this.row
        ? this.row.columns.map((c) =>
            is.notNill(c.visible) ? dynamicPropertyEvaluation$(c.visible, this.formGroup) : new BehaviorSubject(true),
          )
        : [];
    }
  }
}
