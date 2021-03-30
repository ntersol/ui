import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'button[nts]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
