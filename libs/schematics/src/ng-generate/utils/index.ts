import {
  camelize,
  capitalize,
  classify,
  dasherize,
  decamelize,
  featurePath,
  group,
  plural,
  singular,
  underscore,
} from './string';

export {
  addBootstrapToModule,
  addDeclarationToModule,
  addExportToModule,
  addImportToModule,
  addProviderToModule,
  containsProperty,
  findNodes,
  getContentOfKeyLiteral,
  getDecoratorMetadata,
  getSourceNodes,
  insertAfterLastOccurrence,
  insertImport,
  replaceImport,
} from './ast-utils';
export {
  Change,
  commitChanges,
  createChangeRecorder,
  createReplaceChange,
  Host,
  InsertChange,
  NoopChange,
  RemoveChange,
  ReplaceChange,
} from './change';
export { AppConfig, getWorkspace, getWorkspacePath } from './config';
export { buildRelativePath, findModule, findModuleFromOptions, ModuleOptions } from './find-module';
export * from './parse-name';
export { parseName } from './parse-name';
export * from './project';
export { getProject, getProjectPath } from './project';
export * from './workspace';

export const stringUtils = {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
  singular,
  plural,
};
