/**
 * Convert a js object path into one needed by angular form controls
 * @param str 
 */
export const getFormControlPath = (str: string): string => {
  return str.replace(/\[/gi, '.').replace(/\]/gi, '');
};
