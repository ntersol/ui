import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Forms } from '../../../forms.model';
import { dynamicPropertyEvaluation$ } from '../../../utils';

@Component({
  selector: 'nts-form-field-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent implements OnInit, OnChanges {
  @Input() container?: Forms.Container<unknown> | null = null;
  @Input() formGroup?: FormGroup | null = null;
  @Input() options?: Forms.FormOptions | null = null;
  @Input() datafields: Forms.Datafields = {};

  public visible$!: Observable<boolean>;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formGroup'] && this.formGroup) {
      this.visible$ = dynamicPropertyEvaluation$(this.container.visible, this.formGroup);
    }
  }
}
