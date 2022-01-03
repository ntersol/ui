import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';
import { HighlightService } from '../../../../shared/services/highlight.service';

const required = (control?: AbstractControl | null): ValidationErrors | null => {
  if (!control) {
    return null;
  }
  if (!control.value) {
    return {
      'requiredabc': 'This field is required loser'
    }
  }
  return null;
}

@Component({
  selector: 'nts-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  public form = this.fb.group({
    modelText: [null, [required]],
    modelText2: [null, []],
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
    const c = this.form?.get('modelText');
    c?.setErrors({ 'busted': true });
    console.log(c?.getError('busted'));

  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}
