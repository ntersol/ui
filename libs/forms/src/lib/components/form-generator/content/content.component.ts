import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Forms } from '../../../forms.model';

@Component({
  selector: 'cmg-clear2-ui-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  @Input() content?: Forms.Content<unknown> | null = null;
  @Input() formGroup?: FormGroup | null = null;
  @Input() options?: Forms.FormOptions | null = null;
  @Input() datafields: Forms.Datafields = {};
  constructor() {}

  ngOnInit(): void {}
}
