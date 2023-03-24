import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Forms } from '../../../forms.model';
import { is } from '../../../utils';
import { dynamicPropertyEvaluation$ } from '../../../utils/dynamic-property-evaluation.util';

@Component({
  selector: 'nts-form-field-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent implements OnInit, OnChanges {
  @Input() container?: Forms.Container | null = null;
  @Input() formGroup = new FormGroup({});
  @Input() options?: Forms.FormOptions | null = null;
  /** Datafields for dynamic data */
  @Input() datafields?: Forms.Datafields | null = {};

  public visible$: Observable<boolean> = new BehaviorSubject(true);
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formGroup'] && this.formGroup && is.notNill(this.container?.visible)) {
      this.visible$ = dynamicPropertyEvaluation$(this.container?.visible, this.formGroup);
      this.visible$.subscribe(console.log);
    }
  }
}
