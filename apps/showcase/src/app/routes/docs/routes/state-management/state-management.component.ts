import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HighlightService } from '../../shared/services/highlight.service';
import { importExample, install, usage1, usage2, usage3 } from './code-examples';

@Component({
  selector: 'nts-state-management',
  templateUrl: './state-management.component.html',
  styleUrls: ['./state-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementComponent implements OnInit {
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
