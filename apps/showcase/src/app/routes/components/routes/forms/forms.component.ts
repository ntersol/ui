import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
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


  public modelText: any = null;
  public modelNumber: any = null;
  public modelNumber2: any = null;
  public modelNumber3: any = null;
  public currency: any = null;
  public currency2: any = null;

  public exampleimport2 = this.highlight.htmlEncode(``);
  public exampleTS: string = this.highlight.htmlEncode(``);
  public exampleHTML: string = this.highlight.htmlEncode(``);

  constructor(private highlight: HighlightService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}
