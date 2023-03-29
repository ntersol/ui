import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { layoutCode } from '../../form.code-examples';
import { layoutModel } from '../../form.model';

@Component({
  selector: 'nts-layout-demo',
  templateUrl: './layout-demo.component.html',
  styleUrls: ['./layout-demo.component.scss'],
})
export class LayoutDemoComponent implements OnInit {
  public layoutCode = layoutCode;

  public layoutForm = this.fb.group({
    nameFirst: [null],
    nameLast: [null],
  });
  public layoutModel = layoutModel;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
