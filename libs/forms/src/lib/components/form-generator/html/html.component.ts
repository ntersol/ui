import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Forms } from '../../../forms.model';
import { dynamicPropertyEvaluation$, expressionReplacer, expressionReplacer$ } from '../../../utils';

@Component({
  selector: 'cmg-clear2-ui-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlComponent implements OnInit, OnChanges {
  @Input() content?: Forms.Html<unknown> | null = null;
  @Input() options?: Forms.FormOptions | null = null;
  @Input() formGroup?: FormGroup | null = null;

  public visible$!: Observable<boolean>;
  public html$!: Observable<string>;
  
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formGroup'] && this.formGroup) {
      this.visible$ = dynamicPropertyEvaluation$(this.content.visible, this.formGroup);
      this.html$ = expressionReplacer$(this.formGroup, this.content.html);
    }
  }
}
