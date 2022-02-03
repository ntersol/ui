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
import { getProjectPath, parseName, stringUtils } from '../utils';

interface Options {
  name: string;
  path?: string;
}

function addFiles(options: Options) {
  return async (host: Tree) => {
    options.path = await getProjectPath(host, options);

    const parsedPath = parseName(options);

    (parsedPath as any).path = parsedPath.path;

    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      template({
        ...stringUtils,
        ...(options as object),
      } as any),
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
