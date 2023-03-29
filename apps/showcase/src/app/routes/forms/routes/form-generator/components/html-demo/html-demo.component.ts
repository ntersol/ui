import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HighlightService } from '../../../../../../shared/services/highlight.service';
import { htmlCode } from '../../form.code-examples';
import { htmlModel, userModel } from '../../form.model';

@Component({
  selector: 'nts-html-demo',
  templateUrl: './html-demo.component.html',
  styleUrls: ['./html-demo.component.scss'],
})
export class HtmlDemoComponent implements OnInit {
  public htmlModel = htmlModel;
  public htmlCode = this.highlight.htmlEncode(htmlCode);

  public formGroup = this.fb.group(userModel);

  constructor(private highlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit(): void {}
}
