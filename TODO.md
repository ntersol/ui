## Lib Ideas:

- Standardize form field configurations with https://wiki.whatwg.org/wiki/Autocomplete_Types
  - Label
  - Control
    - Autocomplete
    - Autocapitalize
    - Inputmode
    - Type
    - Pattern
    - Mask
    - Placeholder
  - Error Message
  - Hint
- Make project configs their own library within
  - Prettier => i.e. extends @ntersol/prettier
  - ESLint => i.e. extends @ntersol/eslint-rules
  - TSConfig…
- Make sure these standards are running in the editor as well as the CLI in case there are discrepancies in developer tooling
- Simplify UI Dependencies

## Process

- Standardize commit messages with http://commitizen.github.io/cz-cli/
- Standardize SDLC communication with https://conventionalcomments.org/

## Starter:

- Remove components from within the application that are not a layout or page
  - Most components should be built or maintained in a relevant library using the standards in place on those schematics
- Analytics - weigh cost of https://heap.io/ vs the cost of the client paying dev hours for GA/MP event implementation
  - Heap captures everything automatically and let's the admin user reduce it down to what they want on their own
- Are there any chores that you have to do when spinning up a new starter for a client?
- With one .svg we can create a lot of required imagery for our clients:
  - Use https://ezgif.com/svg-to-png to convert the svg to png
  - Use https://www.npmjs.com/package/ngx-pwa-icons to generate the PWA icons based on that png
  - Use https://realfavicongenerator.net/ to generate various vendor specific settings for PWA
    - There may be a CLI for this now
  - Use https://www.npmjs.com/package/pwa-asset-generator to generate screenshots or splash screen images
