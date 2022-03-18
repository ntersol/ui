import { chain, noop, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getProjectFromWorkspace } from '@angular/cdk/schematics';
import { addPackageJsonDependency, NodeDependency } from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { AddSchema } from './schema';

function addPackageJsonDependencies(options: AddSchema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [];

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

function injectImports(options: AddSchema) {
  return async (host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace);
  };
}

function setSchematicsAsDefault(): Rule {
  return (host: Tree, context: SchematicContext) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const exec = require('child_process').exec;

    exec('ng config cli.defaultCollection @ntersol/schematics', () => {
      context.logger.log('info', `✅️ Setting Ntersol schematics as default`);
    });
    return host;
  };
}

function log(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.log('info', `👏 Create your first route by running: ng g r src/app/routes/feature`);

    return host;
  };
}

export default function ngAdd(options: AddSchema): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(options),
    options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
    injectImports(options),
    setSchematicsAsDefault(),
    log(),
  ]);
}

export * from './schema';
