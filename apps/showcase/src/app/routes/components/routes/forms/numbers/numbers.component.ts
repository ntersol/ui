import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'nts-numbers',
  templateUrl: './numbers.component.html',
  styleUrls: ['./numbers.component.scss']
})
export class NumbersComponent implements OnInit {

  public formGroup = this.fb.group({
    modelText: [],
    disabled: [],
    focused: [],
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
