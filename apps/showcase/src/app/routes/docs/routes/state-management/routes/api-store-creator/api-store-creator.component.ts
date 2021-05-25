import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { install, importExample, usage1, usage2, usage3 } from '../../code-examples';

@Component({
  selector: 'nts-api-store-creator',
  templateUrl: './api-store-creator.component.html',
  styleUrls: ['./api-store-creator.component.scss'],
})
export class ApiStoreCreatorComponent implements OnInit {
  public install = install;
  public importExample = importExample;
  public usage1 = usage1;
  public usage2 = usage2;
  public usage3 = usage3;

  constructor(private highlight: HighlightService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
