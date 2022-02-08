import { strings } from '@angular-devkit/core';
import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';

interface Options {
  name: string;
  path?: string;
}

function addFiles(options: Options) {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const projectName = workspace.projects.keys().next().value;
    const project = workspace.projects.get(projectName);

    if (options.path === undefined && project) options.path = buildDefaultPath(project);
    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...options,
      }),
      move(parsedPath.path),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}

export default function (options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([branchAndMerge(addFiles(options))])(host, context);
  };
}
