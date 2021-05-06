export interface UIStoreSelectOptions {
  /** By default, distinctUntilChanged is enabled for all selectors.
   * Set this to true to receive every emission regardless of whether or not it is unique */
  disableDistinct?: true;
}
