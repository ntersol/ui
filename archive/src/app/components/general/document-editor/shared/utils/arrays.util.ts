/**
 *  Insert an item or items at the specified index in an array
 * @param arr
 * @param index
 * @param newItem
 */
export const insertAt = <t>(arr: t[], index: number, items: t | t[]) => {
  const itemsArray = Array.isArray(items) ? items : [items];
  return [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    ...itemsArray,
    // part of the array after the specified index
    ...arr.slice(index),
  ];
};
