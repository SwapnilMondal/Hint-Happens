# Hint Happens!

A mobile-first two-player browser word guessing game. No installation or app download is required.

## Features
- Seven categories: Animals, Countries, Food, Places, Movies, Music, Sports.
- 100 unique words per category (700 entries in the shipped deck).
- 5- or 10-round matches, easy/medium/hard/mixed difficulty, and custom-word mode.
- Host clue cards, 60-second rounds, randomly revealed letters, scoring and streaks.
- Category-specific colour themes and synthesized sound effects (toggleable on either phone).
- Two-player rooms via PeerJS; host rejects additional incoming connections.
- Recent-word cache: host browser remembers words from the previous 10 sessions in localStorage. It is not shared between devices/browsers.

## Run locally
Open `index.html` in a browser, or serve the folder with a static web server. PeerJS signaling requires internet.

## Publish with GitHub Pages
1. Ensure `index.html` is in the repository root.
2. In repository Settings → Pages, select **GitHub Actions** as the deployment source if it isn't already selected.
3. Push `index.html` to `main`. The workflow in `.github/workflows/pages.yml` deploys it automatically.
4. Share the published HTTPS URL. Players open the same URL on their phones, create/join a room, and play.

## Notes
- No framework is needed: this is a static vanilla JavaScript app, so it has no bundling/build step.
- Word history is stored on the host's browser only. Exiting the match clears the room but retains the host's recent-word cache.
- Real two-phone connection testing is still required; browser testing here was blocked by the local-browser policy. JavaScript syntax and word-bank integrity checks passed.
- The repository already has a `CNAME` for `hinthappens.io`; custom-domain DNS and Pages settings must also be configured.
