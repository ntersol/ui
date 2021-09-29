import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { StateManagementService } from '../../shared/state-management.service';
import { install, importExample, usage1, usage2, usage3 } from './code-examples';

@Component({
  selector: 'nts-ui-store-creator',
  templateUrl: './ui-store-creator.component.html',
  styleUrls: ['./ui-store-creator.component.scss'],
})
export class UiStoreCreatorComponent implements OnInit {
  public install = install;
  public importExample = importExample;
  public usage1 = usage1;
  public usage2 = usage2;
  public usage3 = usage3;
  public name$ = this.sm.uiStore.select$('name');
  public name2$ = this.sm.uiStore.select$(state => state.user?.age);
  public name: string | null = null;

  constructor(private sm: StateManagementService, private highlight: HighlightService) { }

  ngOnInit(): void {
    this.name$.subscribe(x => console.log(x));
    this.name2$.subscribe(x => console.log(x));
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

  public nameSave(name: string | null) {
    this.sm.uiStore.update({ name: name });
  }
}
