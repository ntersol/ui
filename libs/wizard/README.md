# wizard

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test wizard` to execute the unit tests.

## Publish Instructions

In order to the publish the wizard,

1. Open the root tsconfig.base.json
2. Remove the following line from the paths `"@ntersol/forms": ["libs/forms/src/index.ts"],`
3. Publish the wizard
4. Undo the changes to tsconfig.base.json
