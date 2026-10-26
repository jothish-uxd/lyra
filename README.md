# Lyra

Lyra (pronounced *LEER-uh*) is an AAC (augmentative and alternative communication) web app. People who don't speak, or don't speak yet, tap pictures to build a sentence and Lyra says it aloud.

It runs in any modern browser, installs to a tablet or phone home screen, and works fully offline. Everything a caregiver adds, including photos, is stored on the device only.

## What's in it

- **Core words** (I, want, need, more, help, yes, no, stop) in a fixed strip that never moves, so they can be found by motor memory.
- **Category rail** (People, Food, Places, Actions, Feelings, Body, School, Toys, Routines) with picture cards.
- **Sentence bar** with Speak, Back and Clear. Each word can also be spoken as it's tapped.
- **Quick phrases** for things said every day, and caregivers can save the current sentence as a new one.
- **Caregiver settings**, opened by pressing and holding the gear so a child doesn't wander in:
  - add cards with a family photo or emoji
  - reorder and remove cards (removing takes two taps)
  - choose the voice, speed and pitch
  - choose small, medium or large cards
  - reset to the starter board

## Development

Requires Node 20 or newer.

```sh
npm install
npm run dev        # local dev server
npm test           # unit tests
npm run build      # type-check and production build into dist/
npm run preview    # serve the production build (service worker active)
```

Built with Vite, React and TypeScript. `vite-plugin-pwa` generates the service worker and manifest. Board data and photos are kept in IndexedDB through `idb-keyval`.

## Project layout

```
src/
  App.tsx              board screen, wiring
  components/          sentence bar, rail, grid, caregiver dialog
  data/defaults.ts     starter vocabulary
  state/board.ts       reducers for the board and the sentence
  lib/storage.ts       IndexedDB persistence and photo resizing
  lib/speech.ts        speech synthesis with voice settings
```

## Not done yet

- Backup and restore (export the board and photos to a file).
- Recording a family member's voice for a card.
- Symbol sets beyond emoji (for example ARASAAC pictograms).
- Review by a speech-language pathologist, and testing with switch access and screen readers.
