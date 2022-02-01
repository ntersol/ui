export interface PageGeneratorSchema {
  name: string;
  directory?: string;
}

export interface NormalizedSchema extends PageGeneratorSchema {
  projectRoot: string;
}
