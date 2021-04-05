/**
 * Perform a shallow merge of any supplied objects while preserving any accessors
 * @param ob
 * @param o
 */
export const assign = <t>(ob: any, ...o: object[]): t => {
  const objNew = { ...ob };
  o.forEach((obj) => Object.defineProperties(objNew, Object.getOwnPropertyDescriptors(obj)));
  return objNew;
};
