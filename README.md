# Mello Labs Angular Starter

A rapid starter project for creating Angular single page apps. Contains Angular 5, Typescript, Bootstrap 4, Ng-Bootstrap & Ngrx-Store 4 (Redux). Built with Angular CLI.

## Quick Start

```bash
# Clone the repo
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/JerrolKrause/mello-labs-angular-starter.git

# Change directory to the repo. Rename project as necessary.
cd mello-labs-angular-starter

# Install the repo with yarn or npm
yarn or npm i
```

## Usage
See Angular CLI github page for full usage: https://github.com/angular/angular-cli

```bash
# Serve dev on http://localhost:4200/
ng serve

# Build for prod
ng build --prod
```

## Localizing Your App
`src > app > shared > app.settings.ts`
-Add global environment variables in 

`src > app > shared > auth.service.ts`
- Set `hasAuthEndpoint` property to true if auth endpoint is available, otherwise leave false for dev
- Set `authUrl` property to your endpoint location

`src > app > shared > api.service.ts`
- Set `envSettingsUrlProd` property to location of environment settings
- Update `appSettingsUpdate` method to hydrate environment settings into app settings

`src > index.html`
-Update any header changes to the html in this file. IE logo, navigation, etc.

## Useful Commands
```bash
# Serve prod after running ng build --prod. Requires http server when you can install with `npm install http-server -g`
http-server ./dist -o
ng serve --prod

# Update all npm packages
npm install -g npm-check-updates && ncu -a && npm i
```