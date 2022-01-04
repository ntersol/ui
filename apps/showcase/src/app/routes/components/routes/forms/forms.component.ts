import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';
import { NtsValidators } from '../../../../../../../../libs/forms/src';
import { HighlightService } from '../../../../shared/services/highlight.service';

// https://dev.to/vishesh/custom-error-handling-in-angular-reactive-forms-5f05
const required = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return {
      'required123': 'This field is required loser'
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
    modelText: [null, [NtsValidators.required]],
    modelText2: [null, []],

    modelNumber: [null, [NtsValidators.Chars.isEqualTo(5, 'Please enter a valid 5 digit zip code')]],
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
