import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnInit {

  public dataSets = [
    {
      label: 'Test',
      data: [3, 4, 1, 8, 3, 1, 5, 8, 4, 3],
    },
  ];

  public dataSets2 = [
    {
      label: 'Test',
      data: [3, 3, 1],
    },
    {
      label: 'Hello',
      data: [13, 8, 3],
    },
    {
      label: 'Once',
      data: [7, 1, 2],
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  public formatTooltip(test: any, _test2: any) {
    // console.log(test, test2)
    return test + 100;
  }

}
