# Mello Labs Angular Starter

A rapid starter project for creating Angular single page apps. Contains Angular 5, lodash, Bootstrap 4, Ng-Bootstrap & Ngrx-Store 4 (Redux). Built with Angular CLI.

## Quick Start

```bash
# Clone the repo
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/JerrolKrause/mello-labs-angular-starter.git

# Change directory to the repo. Rename project as necessary
cd mello-labs-angular-starter

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

# Build for prod
ng build --prod

# Build and serve prod
ng serve --prod
```

## Localizing Your App
`src > app > shared > app.settings.ts`
- Add global environment variables
- Update any development domains

`src > app > shared > auth.service.ts`
- Set `hasAuthEndpoint` property to true if auth endpoint is available, otherwise leave false for dev
- Set `authUrl` property to your endpoint location

`src > app > shared > api.service.ts`
- Set `envSettingsUrlProd` property to location of environment settings
- Update `appSettingsUpdate` method to hydrate environment settings into app settings

`src > index.html`
-Update any header changes to the html in this file. IE logo, navigation, etc. This is a poor man's app-Shell since ng-bootstrap isn't compatible with SSR

`src > ngsw-config.json`
-Update any dependencies needed for the service worker. Use asset groups for site resources, use dataGroups for API calls

## Useful Info
Serve prod after running `ng build --prod` with non CLI based http server. Requires http server when you can install with `npm install http-server -g`
```bash
http-server ./dist -o
```

Update all npm packages
```bash
npm install -g npm-check-updates && ncu -a && npm i
```

When working with Yarn Link and your local NPM package src folders (uncompiled .ts), use the following boilerplate in your root tsconfig so that Angular CLI will compile and build on save and not throw an Angular package error
```bash
"include": [
	"src/**/*",
	"node_modules/@mello-labs/form-tools/**/*",
	"node_modules/@mello-labs/api-tools/**/*",
	"node_modules/@mello-labs/datagrid/**/*",
	"node_modules/@mello-labs/utilities/**/*"
]
```