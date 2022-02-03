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
import { getProjectFromWorkspace } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { getProjectPath, parseName, stringUtils } from '../utils';
import { dasherize } from '../utils/string';

function buildSelector(options: any, projectPrefix: string) {
  let selector = dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}

function addFiles(options: any) {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace);
    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options);

    (parsedPath as any).path = parsedPath.path.replace(`${options.dirName}`, `${parsedPath.name}/`);

    options.name = parsedPath.name;
    options.path = parsedPath.path;
    options.selector = options.selector || buildSelector(options, project.prefix || '');

    const templateSource = apply(url('./files'), [
      template({
        ...stringUtils,
        ...(options as object),
      } as any),
      move(parsedPath.path),
    ]);

    return branchAndMerge(chain([mergeWith(templateSource)]));
  };
}

export default function (options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([addFiles(options)])(host, context);
  };
}

// export default function (options: any): Rule {
//   return async (host: Tree, context: SchematicContext) => {
//     const workspace = await getWorkspace(host);
//     const project = getProjectFromWorkspace(workspace, Object.keys(workspace['projects'])[0]);
//     options.path = getProjectPath(host, options);

//     const parsedPath = parseName(options);

//     (parsedPath as any).path = parsedPath.path.replace(`${options.dirName}`, `${parsedPath.name}/`);

//     options.name = parsedPath.name;
//     options.path = parsedPath.path;
//     options.selector = options.selector || buildSelector(options, project.prefix || '');

//     const templateSource = apply(url('./files'), [
//       template({
//         ...stringUtils,
//         ...(options as object),
//       } as any),
//       move(parsedPath.path),
//     ]);

//     return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(host, context);
//   };
// }
