# Crab App v2

Offline iPad app for Blue Swimmer Crab trap surveys. Built on the Catch Logger plumbing: plain HTML/JS installed to the home screen, no server, all data stays on the iPad until it is exported.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app |
| `sw.js` | Offline cache and updates |
| `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Home-screen install and icon |

## Put it online (once)

1. Make a new GitHub repository, e.g. `crab-app` (its own repository, not a branch of Catch Logger).
2. Upload all six files to the top level of the repository.
3. Settings > Pages > Deploy from branch > `main` / root. After a minute it is live at `https://<account>.github.io/crab-app/`.
4. On the iPad, open that address in Safari > Share > Add to Home Screen. Open it once from the icon while online so it stores itself for offline use, and allow location when asked.

Keep a copy of each release zip on the DPIRD drive.

## Release an update

1. Change `APP_VERSION` near the top of the script in `index.html` (e.g. `v2`).
2. Change `VERSION` in `sw.js` to the same value.
3. Upload both files. iPads pick it up next time the app opens with internet (or Setup > Check for updates) and show "Update downloaded · tap to restart".

## Separate from Catch Logger

Crab App uses its own storage names so the two apps never mix data, even on the same github.io address:
IndexedDB `crabApp`, localStorage `crabApp.v1`, caches `crab-app-vN` and `crab-app-fonts`.

## Data entry rules

- Nothing saves until **Enter**, including **Empty pot** (tap Empty pot, then Enter; tap Empty pot again on a marked pot, then Enter, to unmark it).
- Changing site or pot with something typed but not entered asks first: Enter it then move, Clear it and move, or Stay here.
- Bycatch length type (TL, FL, CW) starts unselected for every row and must be tapped when a length is entered.
- Header bait: pick Yelloweye mullet, Sea mullet or Fish frames, or type another. Wind direction: N, S, E, W, NE, SW, NW, SE.
- Every crab is alive with quantity 1 unless a cause of death is tapped.
- Egg stage 1/2/3 sets female + mature. Claws missing max 2, legs max 8.
- Warnings (save on the second Enter tap): CW under 30 mm or over 230 mm, no size, no sex. Limits are in Setup.
- Pot number resets to 1 at each site; every pot gets a running replicate number for the day. A warning appears above 4 pots at a site.
- Default: set any mix of sex/maturity, egg stage, moult and mortality; it refills after every Enter while switched on.

## Export (Export > Email CSV files)

Six CSV files, joined on `header_id`, `site` and `pot_no`:

- `flat`: one row per crab with header, pot and site-environment columns repeated; empty pots get a row with `empty_pot = Y`
- `crabs`, `bycatch`, `pots`, `sites` (environment), `headers`

Every record has a random `record_id`, the `device` ID, `timestamp_utc` and `time_local`, so files from several iPads combine without duplicates.

## For version 2

- Full lookup lists from Power Apps: species with CAAB codes, gear and pot types, bait, regions and sites
- Genetic ID generation (format still to agree)
- Extra field warnings
- Mapping the CSV columns to the Power Apps database
