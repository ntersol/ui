import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Wizard } from '../../wizard';
import { isType } from '../../utils/typeguards.util';
import { WizardFeatureDirective } from '../../shared/directives/feature.directive';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  @Input() content?: Wizard.ContentControl;
  @Input() dataField?: Wizard.Option[] | null;
  @Input() templates: Record<string, WizardFeatureDirective> = {};

  public isType = isType;

  constructor() {}

  ngOnInit() {}

  public log(something: any){
  console.log('something :', something);

  }

}
