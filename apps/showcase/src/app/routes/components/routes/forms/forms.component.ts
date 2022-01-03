import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  public form = this.fb.group({
    modelText: [],
    modelText2: [],
    modelNumber: [],
    modelNumber2: [],
    currency: [],
  });

  public modelText: any = null;
  public modelNumber: any = null;
  public modelNumber2: any = null;
  public modelNumber3: any = null;
  public currency: any = null;
  public currency2: any = null;

  public exampleimport2 = this.highlight.htmlEncode(``);
  public exampleTS: string = this.highlight.htmlEncode(``);
  public exampleHTML: string = this.highlight.htmlEncode(``);

  constructor(private highlight: HighlightService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}
