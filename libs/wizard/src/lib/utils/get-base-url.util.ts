import { Params } from '@angular/router';
/**
 * Return the base url of this route by stripping out all route parameters
 * @param url 
 * @param params 
 */
export const getBaseUrl = (url: string, params: Params) => {
  const slugs = url.split('/').filter(val =>
    val === '' ||
    Object.keys(params)
      .map(k => params[k])
      .includes(val)
      ? false
      : true,
  );
  return slugs.join('/');
};
