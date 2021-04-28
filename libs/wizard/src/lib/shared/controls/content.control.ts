import { Wizard } from '../../wizard.models';
import { FormGroup, FormControl } from '@angular/forms';
import { clone } from '../../utils/misc.util';
import { isType } from '../../utils/typeguards.util';
import { assign } from '../../utils/assign.util';
import { getFormControlPath } from '../../utils/form-management/get-form-control.util';
import { getValidators } from '../../utils/get-validators.util';
import { getOrCreateFormControl } from '../../utils/form-management/get-or-create-form-control.util';

/**
 * Create a new content control
 * @param content
 * @param form
 * @param indexes
 */
export const contentControlCreate = (
  content: Wizard.Content,
  rulesEngine: Wizard.RulesEngine,
  expressionReplacer: (str: string | null | undefined) => string,
  form: FormGroup,
  formActive: FormGroup,
): Wizard.ContentTypeControl => {
  // Clone source control
  const src = clone<Wizard.Content>(content);
  // Add in universal default props
  const srcDefaults = assign<Wizard.Content>(src, {
    src: src,

    get visible() {
      return isType.ruleGroup(src.visible) ? rulesEngine(src.visible) : src.visible === false ? false : true;
    },
  });
  // Modify the objects based on the content type

  if (isType.html(srcDefaults)) {
    /**
     * Html
     */
    const castMe = srcDefaults;
    return assign<Wizard.Html>(srcDefaults, {
      get html() {
        return expressionReplacer(castMe.html);
      },
      get visible() {
        return isType.ruleGroup(src.visible) ? rulesEngine(src.visible) : src.visible === false ? false : true;
      },
    });
  } else if (isType.feature(srcDefaults)) {
    /**
     * Feature
     */
    return assign<Wizard.Feature>(srcDefaults, {
      featureId: srcDefaults.featureId,
      get visible() {
        return isType.ruleGroup(src.visible) ? rulesEngine(src.visible) : src.visible === false ? false : true;
      },
    });
  } else if (isType.formField(srcDefaults)) {
    /**
     * Form Field
     */
    const castMe = srcDefaults;
    return assign<Wizard.FormField>(srcDefaults, {
      get placeholder() {
        return expressionReplacer(castMe.placeholder || '');
      },
      get visible() {
        return isType.ruleGroup(src.visible) ? rulesEngine(src.visible) : src.visible === false ? false : true;
      },
      get formControl() {
        try {
          const path = getFormControlPath(castMe.field.trim());

          const frmSrc = path.includes('$$active') ? formActive : form;
          const pathSrc = path.includes('$$active')
            ? path
                .split('.')
                .filter((s) => s !== '$$active')
                .join(',')
            : path;
          const isFormArray = castMe.formFieldType === 'checkbox' ? true : false;
          const formField = getOrCreateFormControl(frmSrc)(pathSrc, isFormArray);
          // TODO: Separate util to check for and extract active field if found
          if (formField) {
            // Add validators, if any. Required is default
            formField.setValidators(getValidators(castMe.validators));
            return formField;
          } else {
            console.error(`<Wizard> Unable to find a form field of ${castMe.field}. `, castMe);
            return new FormControl();
          }
        } catch (err) {
          console.error(`<Wizard> Unable to find a form field of ${castMe.field}. `, err, castMe);
          return new FormControl();
        }
      },
    });
  } else {
    /**
     * Default Content type
     */
    return srcDefaults;
  }
};
