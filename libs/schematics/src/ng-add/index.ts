import { chain, noop, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addModuleImportToRootModule, getProjectFromWorkspace, getProjectMainFile } from '@angular/cdk/schematics';
import { InsertChange } from '@schematics/angular/utility/change';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import * as ts from 'typescript';
import { Schema } from './schema';
import { insertImport } from './utils';

function addPackageJsonDependencies(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      {
        type: NodeDependencyType.Default,
        version: '~0.0.20',
        name: '@ntersol/schematics',
      },
    ];

    if (options.documentEditor) {
      dependencies.push({
        type: NodeDependencyType.Default,
        version: '~0.0.20',
        name: '@ntersol/document-editor',
      });
    }

    dependencies.forEach((dependency) => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });

    return host;
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}

function getTsSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not read file (${path}).`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

  return source;
}

function injectImports(options: Schema) {
  return async (host: Tree, _context: SchematicContext) => {
    if (!options.documentEditor) {
      return;
    }

    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace);
    const modulePath = getAppModulePath(host, getProjectMainFile(project));
    const moduleSource = getTsSourceFile(host, modulePath);

    if (options.documentEditor) {
      const docsChange = insertImport(moduleSource, modulePath, 'NtsDocumentEditorModule', '@ntersol/document-editor');
      if (docsChange) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((docsChange as InsertChange).pos, (docsChange as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }
  };
}

function setSchematicsAsDefault(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const exec = require('child_process').exec;

    exec('ng config cli.defaultCollection @ntersol/schematics', () => {
      context.logger.log('info', `✅️ Setting Ntersol schematics as default`);
    });
    return host;
  };
}

function addModuleToImports(options: Schema) {
  return async (host: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace);

    let importDocumentEditor = '';

    if (options.documentEditor) {
      importDocumentEditor = `NtsDocumentEditorModule`;
    }

    if (importDocumentEditor) {
      addModuleImportToRootModule(host, importDocumentEditor, project.sourceRoot || '', project);
    }

    if (options.documentEditor) {
      context.logger.log('info', `🦄 NtersolDocumentEditor is imported`);
    }
  };
}

function log(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.log('info', `👏 Create your first route by running: ng g route --name home`);

    return host;
  };
}

export default function ngAdd(options: Schema): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(options),
    options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
    addModuleToImports(options),
    injectImports(options),
    setSchematicsAsDefault(),
    log(),
  ]);
}
