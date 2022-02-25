import { BuilderContext, BuilderOutput, createBuilder, targetFromTargetString } from '@angular-devkit/architect';
import * as glob from 'glob';
import { Curator } from './curator';
import { Schema } from './schema';

const getFiles = (filesPath: string) => {
  return glob.sync(`**`, {
    ignore: ['.git'],
    cwd: filesPath,
    nodir: true,
    dot: true,
  });
};

export default createBuilder(async (builderConfig: Schema, context: BuilderContext): Promise<BuilderOutput> => {
  context.reportStatus('Executing PWA Asset Generation');
  if (!context.target) {
    throw new Error('Cannot curate assets for an empty target');
  }
  const buildTarget = {
    name: `${context.target.project}:build:production`,
  };

  if (!builderConfig.source) {
    throw new Error('Cannot curate assets without a source image');
  }
  const source = builderConfig.source as string;

  let targetString = `${context.target.project}:curate`;
  if (context.target.configuration) {
    targetString += `:${context.target.configuration}`;
  }

  const curateConfig = await context.getTargetOptions(targetFromTargetString(targetString));
  const build = await context.scheduleTarget(targetFromTargetString(buildTarget.name), {});
  const buildResult: BuilderOutput = await build.result;
  context.logger.info(`✔ Build Completed`);

  if (buildResult.success) {
    const filesPath = buildResult.outputPath as string;
    const files = getFiles(filesPath);

    if (files.length === 0) {
      throw new Error('Target did not produce any files, or the path is incorrect.');
    }

    const options = curateConfig.options as Omit<Schema, 'source'>;

    context.logger.info('Start curating assets...');
    const curator = new Curator(source, filesPath, options);
    const success = await curator.curate();
    if (success) {
      context.logger.info('✔ Finished curating assets...');
      return { success: true };
    } else {
      return {
        error: `❌  Error during asset curation`,
        success: false,
      };
    }
  } else {
    return {
      error: `❌ Application build failed`,
      success: false,
    };
  }
});
