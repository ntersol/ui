import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsValidators } from '@ntersol/forms';

@Component({
  selector: 'nts-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {

  public form = this.fb.group({
    modelText: [null, [NtsValidators.required]],
    modelText2: [null, []],
    disabled: ['James', []],
    zipcode: [null, [NtsValidators.Chars.isEqualTo(5, {
      errorMessage: 'Please enter a valid 5 digit zip code'
    })]],
    population: [],
    currency: [],
  });
  constructor(private fb: FormBuilder) { }

  ngOnInit() { }

  public test() {
    this.form.markAllAsTouched();
    this.form.patchValue(this.form.value);
    // this.form.updateValueAndValidity({onlySelf: false});

  }

}
