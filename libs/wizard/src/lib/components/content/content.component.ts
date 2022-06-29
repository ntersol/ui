import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { NtsWizard } from '../../wizard.models';
import { isType } from '../../utils/typeguards.util';
import { WizardFeatureDirective } from '../../shared/directives/feature.directive';
import { FormControl, FormGroup } from '@angular/forms';
import { getFormControlPath } from '../../utils/form-management/get-form-control.util';

@Component({
  selector: 'nts-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  @Input() form?: FormGroup | null = null;
  @Input() content?: NtsWizard.ContentControl | NtsWizard.ContentType | null = null;
  @Input() dataField?: NtsWizard.Option[] | null = null;
  @Input() templates: Record<string, WizardFeatureDirective> = {};

  /** Used to update change detection */
  @Input() cd: number | null = null;

  @Output() buttonEvent = new EventEmitter<NtsWizard.Button>();

  public isType = isType;
  /** Some buttons have actions that change data. If present, this array holds the form control of the associated field  */
  public buttonActionDataControls: null | (false | any)[] = null; // TODO: Angular does not appear to support chained inline typeguards in the template for type safety: NtsWizard.ActionDataModel

  ngOnInit() {
    // If this is a button group, check to see if there are any data actions
    if (isType.buttonGroup(this.content)) {
      this.buttonActionDataControls = this.content.options.map((o) => {
        const actions = Array.isArray(o.actions) ? o.actions : [o.actions];
        // Only get actions that have a data change
        const action = actions.filter((a) => a.type === 'dataChange')[0];
        // If hasDataChange is requested on the button the action type is datachange
        if (o.hasDataChange && action.type === 'dataChange' && this.form) {
          // Get the associated form control
          return {
            control: this.form.get(getFormControlPath(action.field)) as FormControl,
            value: action.value,
          } as NtsWizard.ActionDataModel;
        }
        return false;
      });
    }
  }
}
