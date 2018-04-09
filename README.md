# Mello Labs Angular Starter

A rapid starter project for creating Angular single page apps. Contains Angular 5, lodash, Bootstrap 4, Ng-Bootstrap & Ngrx-Store (Redux). Built with Angular CLI.

Available online @ https://jerrolkrause.github.io/mello-labs-angular-starter/#/. 

## Quick Start

```bash
# Clone the repo
git clone https://github.com/JerrolKrause/mello-labs-angular-starter.git

# Rename directory from `mello-labs-angular-starter` to `your-app`

# Change directory to the repo
cd your-app

# Install the repo with yarn or npm
yarn
npm i
```
For initial login, any text in the username and password box will work. Be sure to add your auth endpoint as outlined below under localizing your app.


## Usage
See Angular CLI github page for full usage: https://github.com/angular/angular-cli

```bash
# Serve dev on http://localhost:4200/
ng serve

# Build for prod. Files will appear in the dist folder
ng build --prod

# Build and serve prod
ng serve --prod

# Run prettier which will format the code in the entire projects
npm run format

# Run e2e protractor tests
ng e2e

# Run e2e protractor tests without rebuilding every time (faster)
ng e2e -s false

# Deploy dist folder to git pages. Be sure to update deploy script in package.json
npm run deploy

# Update all Angular packages to the latest version
npm run update
```

## Localizing Your App
`package.json`
- If using github pages, update the `npm run deploy` command in this file to include the correct slug. IE replace `/mello-labs-angular-starter/` with your url

`src > environments > environment.ts` +
`src > environments > environment.prod.ts`
- Localize environment settings and properties in these files. Enable/disable app functionality as needed.

`src > app > shared > app.settings.ts`
- Add/change global app & environment variables

`src > index.html`
- Update any header changes to the html in this file. IE logo, navigation, etc. This is a poor man's app-Shell since ng-bootstrap isn't compatible with SSR

`src > manifest.json`
- Change the site info in this file to be specific to your app. Make sure the start Url property matches your production URL

`src > assets > icons`
- Change these icons to ones for your app

`src > ` `apple-touch-icon` + `favicon.ico` + `safari-pinned-tab.svg`
- Change these icons to ones for your app

`src > ngsw-config.json`
- Update any dependencies needed for the service worker. Use asset groups for site resources & use dataGroups for API calls


## Useful Tools

Javascript Prettier for Visual Studio, works the same as the `npm run format`
- https://marketplace.visualstudio.com/items?itemName=MadsKristensen.JavaScriptPrettier

Typescript Linting in Visual Studio without having to run `ng lint` in the command line. Note that this requires the project to be in a solution to work.
- https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebAnalyzer


## Useful Info
Serve prod after running `ng build --prod` with non CLI based http server. Requires http server when you can install with `npm install http-server -g`. Useful for testing service worker.
```bash
http-server ./dist -o
```

Update all npm packages
```bash
npm install -g npm-check-updates && ncu -a && npm i
```

When working with Yarn/NPM Link and your local NPM package src folders (uncompiled .ts), use the following boilerplate in your root tsconfig so that Angular CLI will compile and build on save and not throw an Angular package error
```bash
"include": [
	"src/**/*",
	"node_modules/@mello-labs/form-tools/**/*",
	"node_modules/@mello-labs/api-tools/**/*",
	"node_modules/@mello-labs/datagrid/**/*",
	"node_modules/@mello-labs/utilities/**/*"
]
```
