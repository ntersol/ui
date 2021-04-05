import { Wizard } from '../wizard';

/** Check for wizard types */
export const isType = {
  number: (str: string) => {
    if (typeof str !== 'string') {
      return false;
    }
    return !isNaN(<any>str) && !isNaN(parseFloat(str));
  },
  formField: (content: Wizard.Content): content is Wizard.FormField => content && content.type === 'formField',
  formFieldControl: (content: any): content is Wizard.FormFieldControl => content && content.type === 'formField' && content.formControl,
  html: (content: any): content is Wizard.Html => content && content.type === 'html',
  buttonGroup: (content: any): content is Wizard.ButtonGroup => content && content.type === 'buttonGroup',
  feature: (content: any): content is Wizard.Feature => content && content.type === 'feature',
  row: (content: Wizard.Content): content is Wizard.Row => content && content.type === 'row',
  column: (content: any): content is Wizard.Column => content && content.columnSize !== undefined,
  ruleGroup: (content: any | any[]): content is Wizard.RuleGroup[] => content && Array.isArray(content) && content[0] && content[0].rules,
  routeNext: (content: any): content is Wizard.RouteNext => content && content.routeNext,
  routeComplete: (content: any): content is Wizard.RouteComplete => content && content.sectionComplete,
  sectionControl: (content: any): content is Wizard.SectionControl => content && content.src && content.position && content.routeStart,
};
