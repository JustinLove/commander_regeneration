# Commander Regeneration

Commanders slowly regain health.

## Requirements

Sandbox game option required.  Players will be prevented from using paste-unit, and the Devmode UI is turned off.

PAMM is required in order to set up the server mod hooks.

## Limitations

No regen occurs while in transports.

Incompatible with other mods that do cheat restriction (Puppetmaster and Murder Party)

## Technical Implementation

The client periodically creates a zero-health unit which immediately dies and (death weapon) causes a planet-wide explosion that does 1 damage; all armor types reduce this damage to 0, except commander which has a -60 multiplier (62.5 is 0.5% health)

### Alternate Implementations

I believe this could be ported to server-script and would be much simplier as a result, but there would be a small amount of original research in how to set up such mods.

The mod could be split into create-unit lockdown, and a client mod that performed regeneration, but the regeneration would stop if that client disconnected, and it's also possible that the sim would reject units from a defeated player.

### Trivia

- Negative damage works for direct fire and splash damage with `splash_damages_allies`.
- Negative damage is rejected for damage volumes.
- Negative armor multipliers work, even for damage volumes.
- Units in transports aren't affected by area damage.
- Direct fire weapons cannot target your own units.
- Secondary fire weapons can target the ground near your units.

## Development

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

PA will upload **all files** in the mod directory, including `node_modules` and maybe even `.git` - you probably don't want to use this in `server_mods` directly, unless you really like waiting.  The template is set up run to run as a project within a peer directory of `server_mods` - I use `server_mods_dev/mod_name`.  The task `grunt copy:mod` will copy the mod files to `../../server_mods/identifier`, you can change the `modPath` in the Gruntfile if you want to run it from somewhere else.

### Available Tasks

- copy:back - copy `live_game.js` from the `server_mods` directory back into the mod
- copy:mod - copy the mod files into `server_mods`
- jsonlint - lint all the mod json files
- json_schema - partial validation of mod json files format using schema by exterminans https://forums.uberent.com/threads/wip-units-ammo-and-tools-json-validation-schema.60451/
- default: json_schema, jsonlint, copy:mod
