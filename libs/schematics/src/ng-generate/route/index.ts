import { normalize, Path, strings } from '@angular-devkit/core';
import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { addRouteDeclarationToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import {
  buildRelativePath,
  findModuleFromOptions,
  MODULE_EXT,
  ROUTING_MODULE_EXT,
} from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import * as ts from 'typescript';

interface Options {
  name: string;
  path?: string;
  module?: string;
  route?: string;
  apiStore?: boolean;
  uiStore?: boolean;
}

function buildRelativeModulePath(options: Options, modulePath: string): string {
  const importModulePath = normalize(
    `/${options.path}/` + strings.dasherize(options.name) + '/' + strings.dasherize(options.name) + '.module',
  );

  return buildRelativePath(modulePath, importModulePath);
}

function addRouteDeclarationToNgModule(options: Options, routingModulePath: Path | undefined): Rule {
  return (host: Tree) => {
    if (!options.route) {
      return host;
    }
    if (!options.module) {
      throw new Error('Module option required when creating a lazy loaded routing module.');
    }

    let path: string;
    if (routingModulePath) {
      path = routingModulePath;
    } else {
      path = options.module;
    }

    const text = host.read(path);
    if (!text) {
      throw new Error(`Couldn't find the module nor its routing module.`);
    }

    const sourceText = text.toString();
    const addDeclaration = addRouteDeclarationToModule(
      ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true),
      path,
      buildRoute(options, options.module),
    ) as InsertChange;

    const recorder = host.beginUpdate(path);
    recorder.insertLeft(addDeclaration.pos, addDeclaration.toAdd);
    host.commitUpdate(recorder);

    return host;
  };
}

function getRoutingModulePath(host: Tree, modulePath: string): Path | undefined {
  const routingModulePath = modulePath.endsWith(ROUTING_MODULE_EXT)
    ? modulePath
    : modulePath.replace(MODULE_EXT, ROUTING_MODULE_EXT);

  return host.exists(routingModulePath) ? normalize(routingModulePath) : undefined;
}

function buildRoute(options: Options, modulePath: string) {
  const relativeModulePath = buildRelativeModulePath(options, modulePath);
  const moduleName = `${strings.classify(options.name)}Module`;
  const loadChildren = `() => import('${relativeModulePath}').then(m => m.${moduleName})`;

  return `{ path: '${options.route}', loadChildren: ${loadChildren} }`;
}

function addFiles(options: Options) {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const projectName = workspace.projects.keys().next().value;
    const project = workspace.projects.get(projectName);

    if (options.path === undefined && project) options.path = buildDefaultPath(project);
    const parsedPath = parseName(`${options.path}/${options.name}`, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    let routingModulePath: Path | undefined;
    const isLazyLoadedModuleGen = !!(options.route && options.module);
    if (isLazyLoadedModuleGen) {
      routingModulePath = getRoutingModulePath(host, options.module as string);
    }

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...options,
      }),
      !options.apiStore ? filter((path) => !path.endsWith('-api-store.service.ts')) : noop(),
      !options.uiStore ? filter((path) => !path.endsWith('-ui-store.service.ts')) : noop(),
      move(parsedPath.path),
    ]);
    return chain([addRouteDeclarationToNgModule(options, routingModulePath), mergeWith(templateSource)]);
  };
}

export default function (options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([branchAndMerge(addFiles(options))])(host, context);
  };
}
