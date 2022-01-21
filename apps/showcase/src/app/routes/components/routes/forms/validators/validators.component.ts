import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsValidators } from '@ntersol/forms';
import { Models } from '../../../../../shared/models';

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

    numCompare: [50],
    numIsGreaterThan2: [null, [NtsValidators.Number.isGreaterThan({ compareToField: 'numCompare' })]],

    // Async
    async: [null, [
    ], [NtsValidators.async({
      apiUrl: '/assets/mock-data/async.validator.json',
      errorMessage: 'That username already exists',
      request: 'get',
      httpClient: this.http,
    })]],
    async2: [null, [
    ], [NtsValidators.async({
      apiUrl: '//jsonplaceholder.typicode.com/users',
      errorMessage: 'That username already exists',
      map: (users: Models.User[], control) => {
        const userNames = users.map(u => u.username.toLowerCase());
        return !userNames.includes(control?.value?.toLowerCase())
      },
      request: 'get',
      httpClient: this.http,
    })]],
    async3: [null, [
    ], [NtsValidators.async({
      apiUrl: '//jsonplaceholder.typicode.com/users',
      errorMessage: (apiResponse: Models.User[], control) => `A username of <strong>${control.value}</strong> already exists in the list of <strong>${apiResponse.length}</strong> available users`,
      map: (users: Models.User[], control) => {
        const userNames = users.map(u => u.username.toLowerCase());
        return !userNames.includes(control?.value?.toLowerCase())
      },
      request: 'get',
      httpClient: this.http,
    })]],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) { }


  ngOnInit() {
  }

  public test() {
    this.form.markAllAsTouched();
    this.form.patchValue(this.form.value);
  }

}
