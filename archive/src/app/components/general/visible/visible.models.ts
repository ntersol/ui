type Base = 'all' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type BaseUp = 'sm-up' | 'md-up' | 'lg-up' | 'xl-up';
type BaseDown = 'xs-down' | 'sm-down' | 'md-down' | 'lg-down';
export type MediaBreakpoints = Base | BaseUp | BaseDown;
export interface VisibiltyRange {
  min: number | null;
  max: number | null;
}
export type MediaQueryRecord = Record<MediaBreakpoints, { min: number | null; max: number | null }>;
