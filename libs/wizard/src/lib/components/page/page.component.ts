import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Wizard } from '../../wizard';
import { WizardFeatureDirective } from '../../shared/directives/feature.directive';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  @Input() page?: Wizard.PageControl;
  @Input() dataFields: Record<string, Wizard.Option[]> = {};
  @Input() templates: Record<string, WizardFeatureDirective> = {};

  constructor() {}

  ngOnInit() {
  }
}
