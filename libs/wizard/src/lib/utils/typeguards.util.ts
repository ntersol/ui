import { FormArray, FormGroup } from '@angular/forms';
import { NtsWizard } from '../wizard.models';

/** Check for wizard types */
export const isType = {
  number: (str: string) => {
    if (typeof str !== 'string') {
      return false;
    }
    return !isNaN(<any>str) && !isNaN(parseFloat(str));
  },
  option: (content: any): content is NtsWizard.Option => !!content && !!content.label,
  formField: (content: NtsWizard.Content): content is NtsWizard.FormField => content && content.type === 'formField',
  formFieldControl: (content: any): content is NtsWizard.FormFieldControl => content && content.type === 'formField' && content.formControl,
  html: (content: any): content is NtsWizard.Html => content && content.type === 'html',
  loop: (content: any): content is NtsWizard.Loop => content && content.type === 'loop',
  button: (content: any): content is NtsWizard.Button => content && content.type === 'button',
  buttonGroup: (content: any): content is NtsWizard.ButtonGroup => content && content.type === 'buttonGroup',
  buttonActionDataChange: (button: false | NtsWizard.ActionDataModel) =>
    button !== false && !!(button as NtsWizard.ActionDataModel).control,
  feature: (content: any): content is NtsWizard.Feature => content && content.type === 'feature',
  row: (content: NtsWizard.Content): content is NtsWizard.Row => content && content.type === 'row',
  column: (content: any): content is NtsWizard.Column => content && content.columnSize !== undefined,
  ruleGroup: (content: any | any[]): content is NtsWizard.RuleGroup[] =>
    content && Array.isArray(content) && content[0] && content[0].rules,
  routeNext: (content: any): content is NtsWizard.RouteNext => content && content.routeNext,
  routeComplete: (content: any): content is NtsWizard.RouteComplete => content && content.sectionComplete,
  sectionControl: (content: any): content is NtsWizard.SectionControl => content && content.src && content.position && content.routeStart,
  loopControl: (content: any): content is NtsWizard.LoopControl => content && content.loopContent,
  formArray: (c: any): c is FormArray => !!(c as FormArray)?.controls && Array.isArray((c as FormArray).controls),
  formGroup: (f: any): f is FormGroup => !!(f as FormGroup)?.controls && !Array.isArray((f as FormArray).controls),
  validatorSync: (v: any): v is NtsWizard.ValidatorSync => v.type === 'sync',
  validatorAsync: (v: any): v is NtsWizard.ValidatorAsync => v.type === 'async',
};
