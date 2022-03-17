import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'nts-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {

  public formGroup = this.fb.group({
    modelText: [],
    disabled: [],
    focused: [],
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
