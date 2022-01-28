import { names, Tree } from '@nrwl/devkit';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import { ArrayLiteralExpression, Identifier, VariableStatement } from 'typescript';
import { NormalizedSchema } from './schema';

export function updateAppRoutingModule(tree: Tree, options: NormalizedSchema) {
  const appRoutingModuleFilePath = path.join(options.projectRoot, '/src/app/app.routes.ts');

  const appRoutingModule = readFileIfExisting(appRoutingModuleFilePath);

  if (appRoutingModule !== '') {
    const newContent = tsquery.replace(appRoutingModule, 'VariableStatement', (node) => {
      const vsNode = node as VariableStatement;
      const declarations = vsNode.declarationList.declarations[0];

      if ((declarations.name as Identifier).escapedText === 'children') {
        const pageNames = names(options.name);
        const importPath = options.directory
          ? `./${options.directory}/${pageNames.fileName}/${pageNames.fileName}.module`
          : `./${pageNames.fileName}/${pageNames.fileName}.module`;

        const toInsert = `{
                    path: '${pageNames.fileName}',
                    loadChildren: () => import('${importPath}').then((m) => m.${pageNames.className}Module,
                },`;

        const arrLiteral = declarations.initializer as ArrayLiteralExpression;

        if (arrLiteral.elements.length > 0) {
          const nodeArray = arrLiteral.elements;

          const insertPosition = nodeArray[0].getStart(arrLiteral.getSourceFile(), true);

          const previousRoutes = vsNode.getFullText();
          const prefix = previousRoutes.substring(0, insertPosition);
          const suffix = previousRoutes.substring(insertPosition);
          const newRoutes = `${prefix}${toInsert}${suffix}`;

          return newRoutes;
        }
      }

      return null;
    });

    if (newContent !== appRoutingModule) {
      tree.write(appRoutingModuleFilePath, newContent);
    }
  }
}
