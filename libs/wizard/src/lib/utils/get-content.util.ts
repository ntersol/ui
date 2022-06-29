import { NtsWizard } from '../wizard.models';
import { isType } from './typeguards.util';

/**
 * Generate a tree of form controls by their path in the form group. This lets us extract the actual content control
 * @param pageControls
 * @returns
 */
export const generateFormControlTree = (pageControls: NtsWizard.PageControl[]) => {
  const formControls = pageControls
    // Get page content
    .map(p => p.content)
    // Flatten all content to a single array
    .reduce((a, b) => [...a, ...b]);
  const controls = getContentById(formControls);

  let obj: Record<string, NtsWizard.PageControl> = {};
  Object.keys(controls).forEach(key => {
    obj = stringToObject(obj, key, controls[key]);
  });
  return obj;
};

/**
 *  Convert a string to an object path
 * @param obj
 * @param path
 * @param value
 * @returns
 */
const stringToObject = (obj: Record<string, any>, path: string | string[], value: any = null) => {
  // Handle str vs str array
  path = typeof path === 'string' ? path.split('.') : path;
  let current = obj;
  // Loop through all paths
  while (path.length > 1) {
    // Get first element
    let head = path[0];
    // Get all elements BUT first
    let tail = path.slice(1);
    path = tail;
    // If destination does not exist, create it
    if (current[head] === undefined) {
      current[head] = {};
    }
    current = current[head];
  }
  current[path[0]] = value;
  return obj;
};

/**
 * Recursive function to turn all page content into a record if an ID is specified
 * @param content
 * @returns
 */
export const getContentById = (content: NtsWizard.ContentTypeControl[]) =>
  content.reduce((a, b) => {
    let obj = { ...a };
    // If an unique ID is supplied, add to record
    if (b.id) {
      // Throw error if dupe id, it will be overwritten
      if (obj[b.id]) {
        // console.error(`<WIZARD> Duplicate id properties found for ${b.id}. Please update to a unique ID`);
      }
      obj[b.id] = b;
    }
    // Add in form fields by their field
    if (isType.formField(b)) {
      obj[b.field] = b;
    }

    // If loop, recurse
    if (isType.loopControl(b)) {
      obj = { ...obj, ...getContentById(b.content) };
      // If row, recurse through columns
    } else if (isType.row(b)) {
      obj = b.columns.reduce((c, d) => {
        return { ...c, ...getContentById(d.content) };
      }, obj);
    }

    return obj;
  }, {} as { [key: string]: NtsWizard.ContentTypeControl });

/**
 * Supply a string to extract the base form control reference
 * @param str
 * @param formControls
 */
export const stringToFormControl = (path: string, formControls: Record<string, any>): Record<string, NtsWizard.FormFieldControl> => {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, formControls);
};

/**
 * Takes a form field control record and determines if its valid or not
 * @param r
 * @returns
 */
export const isFormControlGroupValid = (r: Record<string, NtsWizard.FormFieldControl>) =>
  Object.keys(r)
    .filter(key => r[key].visible)
    .reduce((a, key) => (a === false ? a : r[key].formControl.valid), true);
