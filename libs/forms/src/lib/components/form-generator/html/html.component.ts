import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Forms } from '../../../forms.model';
import { dynamicPropertyEvaluation$ } from '../../../utils/dynamic-property-evaluation.util';
import { expressionReplacer$ } from '../../../utils/expression-replacer.util';

@Component({
  selector: 'nts-form-field-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlComponent implements OnInit, OnChanges {
  @Input() content?: Forms.Html | null = null;
  @Input() options?: Forms.FormOptions | null = null;
  @Input() formGroup = new FormGroup({});

  public visible$: Observable<boolean> = new BehaviorSubject(true);
  public html$: Observable<string | null> = new BehaviorSubject(null);

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formGroup'] && this.formGroup) {
      this.visible$ = dynamicPropertyEvaluation$(this.content?.visible, this.formGroup);
      this.html$ = expressionReplacer$(this.formGroup, this.content?.html);
    }
  }
}
