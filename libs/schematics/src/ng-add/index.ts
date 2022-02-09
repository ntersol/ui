import { chain, noop, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addModuleImportToRootModule, getProjectFromWorkspace } from '@angular/cdk/schematics';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Schema } from './schema';

function addPackageJsonDependencies(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [];

    if (options.documentEditor) {
      dependencies.push({
        type: NodeDependencyType.Default,
        version: '^0.0.27',
        name: '@ntersol/document-editor',
      });
    }

    if (dependencies.length) {
      dependencies.forEach((dependency) => {
        addPackageJsonDependency(host, dependency);
        context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
      });
    }

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

function injectImports(options: Schema) {
  return async (host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace);

    if (options.documentEditor) {
      addModuleImportToRootModule(host, 'NtsDocumentEditorModule', '@ntersol/document-editor', project);
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
    injectImports(options),
    setSchematicsAsDefault(),
    log(),
  ]);
}
