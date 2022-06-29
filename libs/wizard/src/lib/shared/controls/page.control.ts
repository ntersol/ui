import { NtsWizard } from '../../wizard.models';
import { FormGroup } from '@angular/forms';
import { clone } from '../../utils/misc.util';
import { contentControlCreate } from './content.control';
import { isType } from '../../utils/typeguards.util';
import { assign } from '../../utils/assign.util';
import { getPageFormControls } from '../../utils/form-management/get-page-form-controls.util';
import { expressionReplacer } from '../../utils';
import { getValidators } from '../../utils/get-validators.util';
import { getFormControlPath } from '../../utils/form-management/get-form-control.util';
import { getOrCreateFormControl } from '../../utils/form-management/get-or-create-form-control.util';
import { BehaviorSubject } from 'rxjs';

// TODO: figure out better way of extracting form controls via accessor instead of using getPageFormControls(content) everywhere
/**
export class PageControl implements NtsWizard.PageControl {
  constructor() {
  }
}
*/
export const pageControlCreate = (
  page: NtsWizard.Page,
  form: FormGroup,
  validators?: NtsWizard.ValidatorCustom[] | null,
): NtsWizard.PageControl => {
  const src = clone<NtsWizard.Page>(page);
  // Convert content to controls
  const content: NtsWizard.ContentTypeControl[] = src.content.map(c => {
    // If row, recurse into columns content and convert those to a control
    if (isType.row(c)) {
      return assign({}, contentControlCreate(c, form), {
        columns: c.columns.map(c2 =>
          assign(c2, {
            content: c2.content.map(c3 => contentControlCreate(c3, form)),
          }),
        ),
      });
    }
    return contentControlCreate(c, form);
  });

  // Get a list of fields required by this page that do not appear in the content
  const requiredFields =
    src?.requiredFields?.map(c => {
      const path = getFormControlPath(c.field.trim());
      const control = getOrCreateFormControl(form)(path, false);
      control.setValidators(getValidators(c.validators));
      return { ...c, control: control };
    }) || null;

  const errorTop$ = new BehaviorSubject<string | null>(null);
  const errorBottom$ = new BehaviorSubject<string | null>(null);
  /**
   * Main Page Control
   */
  const pageControl: NtsWizard.PageControl = assign<NtsWizard.PageControl>(src, {
    src: src,
    get controlsById() {
      return getPageFormControls(content);
    },
    // contentById: getContentById(content),
    content: content,
    errorTop$: errorTop$,
    errorBottom$: errorBottom$,
    errorChange(message: string | null, location: 'top' | 'bottom' = 'top'): void {
      location === 'top' ? errorTop$.next(message) : errorBottom$.next(message);
    },
    get title() {
      return page.title ? expressionReplacer(form, page.title) : null;
    },
    get titleTag() {
      const tag = page.titleTag || page.title;
      return tag ? expressionReplacer(form, tag) : null;
    },
    get validRequiredFields() {
      return requiredFields ? requiredFields.reduce((a, b) => (a === false || b.control.valid === false ? false : true), true) : true;
    },
    get validPage() {
      // Check if any validators are specified on the page level
      if (page?.validators?.length) {
        // Iterate through all the validators, consolidate into a string array of the error messages
        // .filter(isType.validatorSync)
        const validatorErrors = page?.validators.reduce((a, b) => {
          switch (b.type) {
            case 'custom':
              const errorMessages: string[] | undefined = validators
                // Make sure this is a synchronous validator
                ?.filter(isType.validatorSync)
                // Check if a validator in the pages validator array matches one from the custom validators
                ?.filter(v => v.id === b.validatorId)
                // Send data to the callback function
                .map(v => v.fn({ page: pageControl, form: form }))
                // Only get error responses
                .filter((v): v is NtsWizard.ValidatorFnError => v.valid === false)
                .map(v => v.errorMessage);
              return errorMessages?.length ? [...a, ...errorMessages] : a;
            default:
              return a;
          }
        }, [] as string[]);

        // If any errors, show error messages and fail validation check
        if (validatorErrors.length) {
          pageControl.errorChange(validatorErrors.join('<br/>'));
          return false;
        }
      }
      // Default pass validation check
      return true;
    },
    get validControls() {
      // Get all visible form controls on the page
      const controls = getPageFormControls(content.filter(c => c.visible));
      return Object.keys(controls).reduce((a, b) => (a === false || controls[b].valid === false ? false : true), true);
    },
    get valid() {
      return pageControl.validPage && pageControl.validControls && pageControl.validRequiredFields;
    },
    pageTouched: false,
    controlsMarkAsTouched: function () {
      const controls = getPageFormControls(content);
      Object.keys(controls).forEach(key => {
        controls[key].markAsTouched();
        controls[key].updateValueAndValidity();
      });
    },
    controlsMarkAsUntouched: function () {
      const controls = getPageFormControls(content);
      Object.keys(getPageFormControls(content)).forEach(key => {
        controls[key].markAsUntouched();
        controls[key].updateValueAndValidity();
      });
    },
  });
  return pageControl;
};
