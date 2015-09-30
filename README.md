# Commander Regeneration

Commanders slowly regain health.

## Limitations

Incompatible with other mods that override the commanders. Since many commanders specialize tools, we have to shadow them all.

Muzzle flash turned off because it was going continuously.

## Implementation

The commander has an auto-fire time-ammo tool (similar to ragnorok)  The ammo thus fired has a tiny splash with a -60 multiplier (62.5 is 0.5% health)

## Development

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

PA will upload **all files** in the mod directory, including `node_modules` and maybe even `.git` - you probably don't want to use this in `server_mods` directly, unless you really like waiting.  The template is set up run to run as a project within a peer directory of `server_mods` - I use `server_mods_dev/mod_name`.  The task `grunt copy:mod` will copy the mod files to `../../server_mods/identifier`, you can change the `modPath` in the Gruntfile if you want to run it from somewhere else.

### Available Tasks

- proc - create a modified commander from the current vanilla, assuming it can find base file
- copy:mod - copy the mod files into `server_mods`
- default: proc, copy:mod
