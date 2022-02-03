export interface Schema {
  /**
   * Skip adding dependencies and installing them
   */
  skipPackageJson?: boolean;

  /**
   * Add the the document editor
   */
  documentEditor?: boolean;

  project?: any;
}
