import { MediaQueryRecord, MediaBreakpoints, VisibiltyRange } from './visible.models';

/**
 * Determine the visibility range of the breakpoints
 * @param bp
 * @param mediaQueries
 */
export const getVisibilityRange = (bp: string, mediaQueries: MediaQueryRecord): VisibiltyRange => {
  // Split the breakpoints requested
  const all = bp.split(' ') as MediaBreakpoints[];
  // Create the default min max values
  const val: VisibiltyRange = {
    min: null,
    max: null,
  };
  // Loop through the breakpoints
  all.forEach(v => {
    // If max is null or the media query has a max greater than the current max, update
    if (
      (val?.max === null && mediaQueries[v]?.max !== null) ||
      (mediaQueries[v]?.max && val?.max && (mediaQueries[v]?.max || 0) > val?.max)
    ) {
      val.max = mediaQueries[v].max;
    }
    // If min is null or the media query has a min less than than the current min, update
    if (
      (val?.min === null && mediaQueries[v]?.min !== null) ||
      (mediaQueries[v]?.min && val?.min && (mediaQueries[v]?.max || 0) < val?.min)
    ) {
      val.min = mediaQueries[v].min;
    }
  });
  return val;
};

/**
 * Determine if something should be visible by looking at the queries and comparing against the breakpoint. Uses matchMedia
 * @param bp A string of chainable media queries (MediaBreakpoints). IE "lg xl", "xs sm md", "md-up", "sm-down" etc
 * @param mediaQueries
 */
export const isVisible = (bp: string, mediaQueries: MediaQueryRecord): boolean => {
  if (typeof matchMedia === undefined) {
    console.error('Your browser does not support matchMedia');
    return true;
  }

  // Get visibility range
  const val = getVisibilityRange(bp, mediaQueries);

  // Create the query response based on the min and max values
  let queryResponse = '';
  if (val.min !== null) {
    queryResponse = `(min-width: ${val.min}px)`;
  }
  if (val.min !== null && val.max) {
    queryResponse += ` and (max-width: ${val.max}px)`;
  } else if (val.max) {
    queryResponse += `(max-width: ${val.max}px)`;
  }
  // Use matchMedia to check if the current viewport is valid against the mix and max values
  return matchMedia(queryResponse).matches;
};

/**
 * Convert the requested breakpoints into bootstrap classes
 * @param bp
 */
export const breakpointsToBootStrapClasses = (bp?: string | null, range: MediaBreakpoints[] = ['xs', 'sm', 'md', 'lg', 'xl']) => {
  // If nothing returned or bp is all, show everything
  if (!bp || bp === 'all') {
    return '';
  }
  const all = bp.split(' ') as MediaBreakpoints[];
  const classes: string[] = [];
  // Loop through the ranges and set display block for selected and display none for unselected
  range.forEach(str => {
    all.includes(str) ? classes.push(str === 'xs' ? '' : `d-${str}-block`) : classes.push(str === 'xs' ? 'd-none' : `d-${str}-none`);
  });

  return classes.join(' ');
};
