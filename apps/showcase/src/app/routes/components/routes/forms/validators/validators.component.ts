import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsValidators } from '@ntersol/forms';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'nts-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.scss']
})
export class ValidatorsComponent implements OnInit {

  public form = this.fb.group({
    // Characters
    charsIsEqualTo: [null, [NtsValidators.Chars.isEqualTo(5)]],
    charsIsGreaterThan: [null, [NtsValidators.Chars.isGreaterThan(5)]],
    charsIsLessThan: [null, [NtsValidators.Chars.isLessThan(5)]],

    // Numbers
    numIsGreaterThan: [null, [NtsValidators.Number.isGreaterThan(99)]],
    numIsLessThan: [null, [NtsValidators.Number.isLessThan(10)]],

    // Async
    async: [null, [
    ], [NtsValidators.async({
      apiUrl: '/assets/mock-data/async.validator.json',
      errorMessage: 'That username already exists',
      request: 'get',
      httpClient: this.http,
    })]]
  });

  constructor(private fb: FormBuilder, private http: HttpClient) { }


  ngOnInit() {
  }

  public test() {
    this.form.markAllAsTouched();
    this.form.patchValue(this.form.value);
  }

}
