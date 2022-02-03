import { formatFiles, generateFiles, getWorkspaceLayout, names, offsetFromRoot, Tree } from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedSchema, PageGeneratorSchema } from './schema';
import { updateAppRoutingModule } from './update-routing-file';

function normalizeOptions(tree: Tree, options: PageGeneratorSchema): NormalizedSchema {
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${options.project}`;

  return {
    ...options,
    projectRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    name: names(options.name).fileName,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  const pageDir = options.directory
    ? path.join(options.projectRoot, `/src/app/routes/${options.directory}/${names(options.name).fileName}`)
    : path.join(options.projectRoot, `/src/app/routes/${names(options.name).fileName}`);

  generateFiles(tree, path.join(__dirname, 'files'), pageDir, templateOptions);
}

export async function pageGenerator(tree: Tree, options: PageGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  updateAppRoutingModule(tree, normalizedOptions);
  await formatFiles(tree);
}

export default pageGenerator;
