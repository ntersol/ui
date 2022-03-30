import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-<%= dasherize(name)%>',
  templateUrl: './<%= dasherize(name)%>.component.html',
  styleUrls: ['./<%= dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name)%>Component implements OnInit, OnDestroy {
  name = '<%= name%>';
  constructor() {} // public uiState: UiStateService, // Global UI state // private domainState: DomainService, // Global domain state

  ngOnInit() {}

  ngOnDestroy() {}
}
