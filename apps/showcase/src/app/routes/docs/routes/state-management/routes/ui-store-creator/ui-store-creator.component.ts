import { Component, OnInit } from '@angular/core';
import { StateManagementService } from '../../shared/state-management.service';
// import {  Query } from '@datorama/akita';
@Component({
  selector: 'nts-ui-store-creator',
  templateUrl: './ui-store-creator.component.html',
  styleUrls: ['./ui-store-creator.component.scss'],
})
export class UiStoreCreatorComponent implements OnInit {
  public name$ = this.sm.uiStore.select$('name');
  public name2$ = this.sm.uiStore.select$(state => state.user?.age);
  public name: string | null = null;

  constructor(private sm: StateManagementService) {}

  ngOnInit(): void {
    this.name$.subscribe(x => console.log(x));
    this.name2$.subscribe(x => console.log(x));
  }

  public nameSave(name: string | null) {
    this.sm.uiStore.update({ name: name });
  }
}
