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
Add global environment variables in `src > app > shared > app.settings.ts`

When your authentication API is available, go to `src > app > shared > auth.service.ts`
- Set `hasAuthEndpoint` property to true
- Set `authUrl` property to your endpoint location

In `src > app > shared > api.service.ts`
- Set `envSettingsUrlProd` property to location of environment settings
- Update `appSettingsUpdate` method to hydrate environment settings into app settings