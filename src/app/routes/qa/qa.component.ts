import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss'],
})
export class QaComponent implements OnInit {
  public launchModalWorks: boolean;

  public filterFruit: any;
  public filterFruitMore: any;
  public fruits = [
    'Apple',
    'Orange',
    'Kiwi',
    'Marionberries',
    'Loganberries',
    'Mangostein',
    'Peach',
    'Pear',
    'Blackberries',
    'Strawberries',
  ];
  public fruitsMore = [
    { name: 'Apple' },
    { name: 'Orange' },
    { name: 'Kiwi' },
    { name: 'Marionberries' },
    { name: 'Loganberries' },
    { name: 'Mangostein' },
    { name: 'Peach' },
    { name: 'Pear' },
    { name: 'Blackberries' },
    { name: 'Strawberries' },
  ];

  public dataSets = [
    {
      label: 'Test',
      data: [3,4,1,8,3,1,5,8,4,3]
    },
  
  ];

  public dataSets2 = [
    {
      label: 'Test',
      data: [3,3,1]
    },
    {
      label: 'Hello',
      data: [13,8,3]
    },
    {
      label: 'Once',
      data: [7,1,2]
    },
  ];


  constructor() {}

  ngOnInit() {}

  public launchModalSuccess(event: any) {
    if (event) {
      this.launchModalWorks = true;
    }
  }
}
