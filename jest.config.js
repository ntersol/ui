const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/showcase',
    '<rootDir>/libs/wizard',
    '<rootDir>/libs/forms',
    '<rootDir>/libs/state-management',
    '<rootDir>/libs/chart',
    '<rootDir>/libs/document-editor',
    '<rootDir>/libs/table',
    '<rootDir>/libs/tags',
    '<rootDir>/libs/tree',
    '<rootDir>/libs/visible',
    '<rootDir>/libs/grid',
    '<rootDir>/libs/storybook',
    '<rootDir>/apps/angular-starter',
    '<rootDir>/apps/fresh',
    '<rootDir>/libs/utils',
    '<rootDir>/libs/azure-maps',
  ],
};
