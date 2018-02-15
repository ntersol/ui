import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss']
})
export class QaComponent implements OnInit {

  public launchModalWorks: boolean;

  constructor() { }

  ngOnInit() {
  }

  public launchModalSuccess(event) {
    if (event){
      this.launchModalWorks = true;
    }
  }

}
