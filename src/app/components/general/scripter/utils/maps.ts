import { isNotNil } from './type-guards';

export interface HasGuid {
  guid: string;
}

/**
 * Maps undefined || null to an array
 */
export const toArray = <T>(t?: T[] | null): T[] => (isNotNil(t) ? t : []);

/**
 * Maps an object with a guid to its guid
 */
export const toGuid = <T extends HasGuid>(t: T): string => t.guid;
