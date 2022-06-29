import { NtsWizard } from '../../wizard.models';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { clone } from '../../utils/misc.util';
import { isType } from '../../utils/typeguards.util';
import { assign } from '../../utils/assign.util';
import { getFormControlPath } from '../../utils/form-management/get-form-control.util';
import { getValidators } from '../../utils/get-validators.util';
import { getOrCreateFormControl } from '../../utils/form-management/get-or-create-form-control.util';
import { expressionReplacer, rulesEngine } from '../../utils';
import { isVisible } from '../../utils/visibility.util';
import { isDisabled } from '../../utils/disabled.util';

/** Keep track of the loop index. Needs to be outside the factory to support recursion */
let indexLoop = 0;
/**
 * Create a new content control
 * @param content
 * @param form
 * @param indexes
 */
export const contentControlCreate = (content: NtsWizard.Content, form: FormGroup): NtsWizard.ContentTypeControl => {
  // Clone source control
  const src = clone<NtsWizard.Content>(content);
  // Add in universal default props
  const srcDefaults = assign<NtsWizard.Content>(src, {
    src: src,
    get visible() {
      return isVisible(src, form, indexLoop);
    },
    get disabled() {
      return isDisabled(src, form, indexLoop);
    },
  });

  // Modify the objects based on the content type
  if (isType.loop(srcDefaults)) {
    /**
     * Loop
     */
    // Get form array specified by field property
    let formArray = form.get(srcDefaults.field) as FormArray;
    if (!isType.formArray) {
      console.error('<Wizard> Path is not a form array', srcDefaults.field);
      formArray = new FormArray([]);
    }
    // Loop through the available models inside the form array and build a content array for each one
    const content = formArray?.controls
      .filter(isType.formGroup)
      .map((control, i) => {
        indexLoop = i; // Update index number each loop
        return srcDefaults.content.map(c => {
          // If row, recurse into columns content and convert those to a control
          if (isType.row(c)) {
            return assign({}, contentControlCreate(c, control), {
              columns: c.columns.map(c2 =>
                assign(c2, {
                  content: c2.content.map(c3 => contentControlCreate(c3, control)),
                }),
              ),
            });
          }
          return contentControlCreate(c, control);
        });
      })
      .map(x => (!!x ? x : [])) // Nill check necessary to prevent feeding an empty array to reduce
      .reduce((a, b) => [...(a || []), ...(b || [])], []);

    const loop = assign<NtsWizard.LoopControl>(srcDefaults, {
      src: { ...src },
      formArray: formArray,
      loopIndex: 0,
      get visible() {
        return isVisible(src, form, indexLoop);
      },
      content: content,
      // TODO: This is not great: regenning loop controls on every change detection hit. Necessary for additions to the form array which will not then have a control
      // Need to get rid of accessor. Fires twice on every CD so not urgent
      get loopContent() {
        return formArray?.controls
          .filter(isType.formGroup)
          .map((control, i) => {
            indexLoop = i; // Update index number each loop
            return ((srcDefaults as any) || []).content.map((c: any) => {
              let contentType = contentControlCreate(c, control);
              if (isType.row(c)) {
                contentType = assign({}, contentControlCreate(c, control), {
                  columns: c.columns.map(c2 =>
                    assign(c2, {
                      content: c2.content.map(c3 => contentControlCreate(c3, control)),
                    }),
                  ),
                });
              }
              const c3 = formArray.at(indexLoop);
              return {
                index: indexLoop,
                control: c3,
                content: contentType,
                get deleted() {
                  return !!c3?.get('$$deleted')?.value;
                },
              };
            });
          })
          .map(x => (!!x ? x : [])) // Nill check necessary to prevent feeding an empty array to reduce
          .reduce((a, b) => [...(a || []), ...(b || [])], []);
      },
    });
    return loop;
  } else if (isType.html(srcDefaults)) {
    /**
     * Html
     */
    const castMe = srcDefaults;
    return assign<NtsWizard.Html>(srcDefaults, {
      get html() {
        return expressionReplacer(form, castMe.html);
      },
      get visible() {
        return isVisible(src, form, indexLoop);
      },
    });
  } else if (isType.feature(srcDefaults)) {
    /**
     * Feature
     */
    return assign<NtsWizard.Feature>(srcDefaults, {
      featureId: srcDefaults.featureId,
      get visible() {
        // Add array indexes to loop if specified
        if (Array.isArray(srcDefaults.visible)) {
          srcDefaults.visible.forEach(a => {
            a.rules.forEach(r => {
              if (r.useIndex) {
                r.value = indexLoop;
              }
            });
          });
        }
        return isType.ruleGroup(srcDefaults.visible)
          ? rulesEngine(form, srcDefaults.visible)
          : srcDefaults.visible === false
          ? false
          : true;
      },
    });
  } else if (isType.formField(srcDefaults)) {
    /**
     * Form Field
     */
    const castMe = srcDefaults;
    return assign<NtsWizard.FormField>(srcDefaults, {
      get placeholder() {
        return expressionReplacer(form, castMe.placeholder || '');
      },
      get visible() {
        return isVisible(src, form, indexLoop);
      },
      get disabled() {
        return isDisabled(src as NtsWizard.FormField, form, indexLoop);
      },
      get formControl() {
        try {
          const path = getFormControlPath(castMe.field.trim());
          const isFormArray = castMe.formFieldType === 'checkbox' ? true : false;
          const formField = getOrCreateFormControl(form)(path, isFormArray);
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
    /**
     * Button
     */
  } else if (isType.button(srcDefaults)) {
    // Get all actions
    const actions = Array.isArray(srcDefaults.actions) ? srcDefaults.actions : [srcDefaults.actions];
    // Get all array delete item actions, if index is null set to index from loop
    actions
      .filter((a): a is NtsWizard.ActionArrayDeleteItem => a.type === 'arrayDeleteItem')
      .forEach(a => {
        if (a.index === null || a.index === undefined) {
          a.index = indexLoop;
        }
      });
    //
    actions
      .filter((a): a is NtsWizard.ActionCopyItem => a.type === 'copyItem')
      .forEach(a => {
        if (a.index === null || a.index === undefined) {
          a.index = indexLoop;
        }
      });
    actions
      .filter((a): a is NtsWizard.ActionDataChange => a.type === 'dataChange')
      .forEach(a => {
        if (a.useIndex) {
          a.value = indexLoop;
        }
      });
    /**
     * Button group
     */
  } else if (isType.buttonGroup(srcDefaults)) {
    srcDefaults.options = srcDefaults.options.map(b => {
      b.src = { ...b };
      const actions = Array.isArray(b.actions) ? b.actions : [b.actions];
      actions
        .filter((a): a is NtsWizard.ActionArrayDeleteItem => a.type === 'arrayDeleteItem')
        .forEach(a => {
          if (a.index === null || a.index === undefined) {
            a.index = indexLoop;
          }
        });
      //
      actions
        .filter((a): a is NtsWizard.ActionCopyItem => a.type === 'copyItem')
        .forEach(a => {
          if (a.index === null || a.index === undefined) {
            a.index = indexLoop;
          }
        });
      actions
        .filter((a): a is NtsWizard.ActionDataChange => a.type === 'dataChange')
        .forEach(a => {
          if (a.useIndex) {
            a.value = indexLoop;
          }
        });
      return assign(b, {
        get visible() {
          return isVisible(b.src, form, indexLoop);
        },
        get disabled() {
          return isDisabled(b.src, form, indexLoop);
        },
      });
    });
  }
  /**
   * Default Content type
   */
  return srcDefaults;
};
