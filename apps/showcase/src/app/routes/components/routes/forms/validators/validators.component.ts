import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsValidators } from '@ntersol/forms';

@Component({
  selector: 'nts-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.scss']
})
export class ValidatorsComponent implements OnInit {

  public form = this.fb.group({
    isEqualTo: [null, [NtsValidators.Chars.isEqualTo(5)]],
    isGreaterThan: [null, [NtsValidators.Chars.isGreaterThan(5)]],
    isLessThan: [null, [NtsValidators.Chars.isLessThan(5)]]
  })

  constructor(private fb: FormBuilder) { }


  ngOnInit() {
  }

  public test() {
    this.form.markAllAsTouched();
    this.form.patchValue(this.form.value);
  }

}
