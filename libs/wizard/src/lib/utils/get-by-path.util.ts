import { get } from 'lodash/fp';

export const getByPath = (path: string, model: any, arrayIndexes: any) => {
  if (arrayIndexes) {
  }
  return get(path, model);
};
