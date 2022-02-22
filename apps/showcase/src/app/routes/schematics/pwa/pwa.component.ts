import { AfterViewInit, Component } from '@angular/core';
import { HighlightService } from '../../../shared/services/highlight.service';

@Component({
  selector: 'nts-pwa',
  templateUrl: './pwa.component.html',
  styleUrls: ['./pwa.component.scss'],
})
export class PwaComponent implements AfterViewInit {
  steps = [
    {
      alt: 'Ready SVG',
      description: 'Have an SVG icon ready to convert',
      path: 'n-colored.svg',
      width: 100,
      code: 'favicon.svg',
      type: 'bash',
    },
    {
      alt: 'Add NGSW Config to Root test',
      description: 'Add an `ngsw-config.json` file to the root of your project (where `index.html` is)',
      type: 'json',
      code: `
        {
          "$schema": "../../node_modules/@angular/service-worker/config/schema.json",
          "index": "/index.html",
          "assetGroups": [
            {
              "name": "app",
              "installMode": "prefetch",
              "resources": {
                "files": [
                  "/favicon.ico",
                  "/index.html",
                  "/manifest.webmanifest",
                  "/*.css",
                  "/*.js"
                ]
              }
            },
            {
              "name": "assets",
              "installMode": "lazy",
              "updateMode": "prefetch",
              "resources": {
                "files": [
                  "/assets/**",
                  "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
                ]
              }
            }
          ]
        }
      `,
    },
    {
      alt: 'Add Service Worker to App Module',
      description: 'Add Service Worker to App Module',
      type: 'typescript',
      code: `
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.settings.enableServiceWorker,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000',
        }),
      `,
    },
    {
      alt: 'Update Build Config',
      description: 'Update the build configuration to output root assets at the root and add service worker options',
      type: 'json',
      code: `
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          ...
          "options": {
            ...
            "assets": [
              {
                "glob": "*",
                "input": "apps/showcase/src/root-assets",
                "output": "."
              },
              ...
            ],
            ...
            "serviceWorker": true,
            "ngswConfigPath": "apps/showcase/ngsw-config.json"
          },
          ...
        }
      `,
    },
    {
      alt: 'Add RealFavicon Icons',
      type: 'markup',
      code: this.hs.htmlEncode(`
        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
        <link rel="icon" type="image/svg+xml" href="favicon.svg" />
        <link rel="manifest" href="manifest.webmanifest" />
        <link rel="mask-icon" href="safari-pinned-tab.svg" color="#ff6600" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      `),
      description:
        'Head over to realfavicongenerator.net (RFG) and use the svg generator as well as the default generator. Save and extract both packages. Copy and paste markup from RFG. ',
    },
    {
      alt: 'Add Manifest WebManifest',
      type: 'json',
      code: `
        {
          "name": "Showcase",
          "short_name": "Showcase",
          "theme_color": "#1976d2",
          "background_color": "#fafafa",
          "display": "standalone",
          "scope": "https://ntersol.github.io/ui/",
          "start_url": "https://ntersol.github.io/ui/",
          "icons": []
        }
      `,
      description:
        'Add a web manifest to your project for the generator to append to. You can start with the one from RFG to use appropriate theme colors and start URLs.',
    },
    {
      alt: 'Add Curate Target',
      description:
        'Add curate target to project. Changes directory into the project specificed and applies the icon `n-colored.svg` to the generator.`',
      type: 'json',
      code: `
        "curate": {
          "builder": "@nrwl/workspace:run-commands",
          "options": {
            "cwd": "dist/apps/showcase/",
            "command": "npx pwa-asset-generator ./n-colored.svg -i ./index.html -m ./manifest.webmanifest --path https://ntersol.github.io/ui --path-override https://ntersol.github.io/ui"
          }
        },
      `,
    },
    {
      alt: 'Add GH Target',
      description: 'Add target to run github pages deploy.`',
      type: 'json',
      code: `
        "gh": {
          "builder": "angular-cli-ghpages:deploy",
          "options": {
            "cname": "",
            "noBuild": true,
            "name": "Github Actions",
            "email": "actions@github.com",
            "message": "Auto-generated commit [ci skip]"
          }
        },
      `,
    },
    {
      alt: 'Modify Deploy Target',
      description:
        'Modify deploy target (so its still picked up by CICD) to run a build pointed at the GH href., then curate the PWA assets, then deploy to GH Pages',
      type: 'json',
      code: `
        "deploy": {
          "builder": "@nrwl/workspace:run-commands",
          "options": {
            "commands": [
              "ng run showcase:build:production --baseHref=https://ntersol.github.io/ui/",
              "ng run showcase:curate",
              "ng run showcase:gh"
            ],
            "parallel": false
          }
        }
      `,
    },
  ];

  constructor(public hs: HighlightService) {}

  ngAfterViewInit(): void {
    this.hs.highlightAll();
  }
}
