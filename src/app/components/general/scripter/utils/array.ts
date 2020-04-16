import { posInt } from './numbers';

/**
 * A simple range function that returns an array of length N
 * starting from 0 by default
 */
export const range = (length: number, start: number = 0) => Array.from({ length }, (_, i) => start + i);

/**
 * A range function based on generators that doesn't comsume ungodly
 * amounts of memory for huge ranges.
 */
export function* rangeG(count: number = 0, start: number = 0, step: number = 1) {
  let i = Math.floor(count);
  let cur = start;
  while (i > 0) {
    yield cur;
    cur += step;
    i -= 1;
  }
}

/**
 * The base function for immutable splice and spliceR that returns both the
 * removed items and the resultant array
 */
export const spliceBase = <T>(start: number, count: number, ...items: T[]) => (
  ts: T[],
): { removed: T[]; result: T[] } => {
  const _start = posInt(start);
  const _count = posInt(count);
  const beginning = ts.slice(0, _start);
  const removed = ts.slice(_start, _count);
  const end = ts.slice(_start + _count);
  return {
    removed,
    result: [...beginning, ...items, ...end],
  };
};

/**
 * An immutable version of Array.splice that returns the spliced array instead
 * of the removed items
 */
export const spliceR = <T>(start: number, count: number, ...items: T[]) => (ts: T[]): T[] =>
  spliceBase(start, count, ...items)(ts).result;

/**
 * An immutable version of Array.splice
 */
export const splice = <T>(start: number, count: number, ...items: T[]) => (ts: T[]): T[] =>
  spliceBase(start, count, ...items)(ts).removed;
