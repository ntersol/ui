import { chain, noop, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addModuleImportToRootModule,
  addPackageJsonDependency,
  getAppModulePath,
  getProjectFromWorkspace,
  getWorkspace,
  InsertChange,
  NodeDependency,
  NodeDependencyType,
} from 'schematics-utilities';
import * as ts from 'typescript';
import { Schema } from './schema';
import { addProviderToModule, applyChanges, getModuleFile, insertImport, isImported } from './utils';

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

function injectImports(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.documentEditor) {
      return;
    }
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      options.project ? options.project : Object.keys(workspace['projects'])[0],
    );
    const modulePath = getAppModulePath(host, (project as any).architect.build.options.main);

    const moduleSource = getTsSourceFile(host, modulePath);
    const importModule = 'environment';
    const importPath = '../environments/environment';

    if (!isImported(moduleSource, importModule, importPath)) {
      const change = insertImport(moduleSource, modulePath, importModule, importPath);

      if (change) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }

    if (options.documentEditor) {
      const docsChange = insertImport(moduleSource, modulePath, 'DocumentEditor', '@ntersol/document-editor');
      if (docsChange) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((docsChange as InsertChange).pos, (docsChange as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }

    return host;
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

function addModuleToImports(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      options.project ? options.project : Object.keys(workspace['projects'])[0],
    );

    let importDocumentEditor = '';
    let provideEntityServiceConfig = '';

    if (options.documentEditor) {
      importDocumentEditor = `DocumentEditor`;
    }

    if (importDocumentEditor) {
      addModuleImportToRootModule(host, importDocumentEditor, null as any, project as any);
    }

    if (provideEntityServiceConfig && project.architect) {
      const modulePath = getAppModulePath(host, project.architect.build.options.main);
      const module = getModuleFile(host, modulePath);
      const providerChanges = addProviderToModule(module, modulePath, provideEntityServiceConfig, '');
      applyChanges(host, modulePath, providerChanges as InsertChange[]);
    }

    if (options.documentEditor) {
      context.logger.log('info', `🦄 NtersolDocumentEditor is imported`);
    }

    return host;
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
