import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'nts-mtg-calc',
  templateUrl: './mtg-calc.component.html',
  styleUrls: ['./mtg-calc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MtgCalcComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
