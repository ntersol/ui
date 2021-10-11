/**
 * Remove all nill values from a javascript data structure. This tool supports recursion and will remove all nil values from deeply nested objects/arrays.
 *
 * Removes: Nulls, undefined, empty string, empty arrays, objects with no properties
 *
 * Does not remove: 0, false
 * @param o
 * @returns
 */
export const removeNils = <t>(o: t): t =>
    JSON.parse(JSON.stringify(o), (_key, value) => {
        if (
            value === null ||
            value === undefined ||
            value === '' ||
            value === [] ||
            value === {} ||
            (typeof value === 'object' && Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
        ) {
            return undefined;
        }
        if (typeof value === 'object' && Array.isArray(value) && value.length) {
            const val = value.filter(d => !!d);
            return val.length ? val : undefined;
        }
        return value;
    });
