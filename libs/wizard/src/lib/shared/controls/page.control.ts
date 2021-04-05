import { Wizard } from '../../wizard';
import { FormGroup } from '@angular/forms';
import { clone } from '../../utils/misc.util';
import { contentControlCreate } from './content.control';
import { isType } from '../../utils/typeguards.util';
import { assign } from '../../utils/assign.util';
import { getPageFormControls } from '../../utils/form-management/get-page-form-controls.util';

// TODO: figure out better way of extracting form controls via accessor instead of using getPageFormControls(content) everywhere
/**
export class PageControl implements Wizard.PageControl {

  constructor() {

  }
}
 */
export const pageControlCreate = (
  page: Wizard.Page,
  rulesEngine: Wizard.RulesEngine,
  expressionReplacer: (str: string | null | undefined) => string,
  form: FormGroup,
  formActive: FormGroup,
  pageValidator: Wizard.PageValidatorFn | null,
): Wizard.PageControl => {
  const src = clone<Wizard.Page>(page);
  // Convert content to controls
  const content = src.content.map((c) => {
    // If row, recurse into columns content and convert those to a control
    if (isType.row(c)) {
      return Object.assign({}, c, {
        columns: c.columns.map((c2) =>
          Object.assign(c2, {
            content: c2.content.map((c3) =>
              contentControlCreate(c3, rulesEngine, expressionReplacer, form, formActive),
            ),
          }),
        ),
      });
    }
    return contentControlCreate(c, rulesEngine, expressionReplacer, form, formActive);
  });

  const pageControl = assign<Wizard.PageControl>(src, {
    src: src,
    get controlsById() {
      return getPageFormControls(content);
    },
    content: content,
    errorTop: null,
    errorBottom: null,
    get title() {
      return page.title ? expressionReplacer(page.title) : null;
    },
    get titleTag() {
      const tag = page.titleTag || page.title;
      return tag ? expressionReplacer(tag) : null;
    },
    get valid() {
      return this.validPage && this.validControls;
    },
    get validPage() {
      if (pageValidator) {
        return pageValidator({ form: form });
      }
      return true; // TODO: Implement page level validators
    },
    get validControls() {
      const controls = getPageFormControls(content);
      return Object.keys(controls).reduce((a, b) => (a === false || controls[b].valid === false ? false : true), true);
    },
    pageTouched: false,
    controlsMarkAsTouched: function () {
      const controls = getPageFormControls(content);
      Object.keys(controls).forEach((key) => {
        controls[key].markAsTouched();
        controls[key].updateValueAndValidity();
      });
    },
    controlsMarkAsUntouched: function () {
      const controls = getPageFormControls(content);
      Object.keys(getPageFormControls(content)).forEach((key) => {
        controls[key].markAsUntouched();
        controls[key].updateValueAndValidity();
      });
    },
  });
  return pageControl;
};
