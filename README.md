# Hint Happens!

A mobile-first two-player browser word guessing game. No app install, root access, backend deployment, login, or API key is required.

## Features
- Seven word categories, themed colors/clues, 5/10 rounds, difficulty and custom-word modes.
- 60-second rounds, random letter reveals, scoring, streaks, and synthesized game sounds.
- Two-player rooms via PeerJS. The host generates a fresh random room-sharing code for each room.
- Radio button + next button: free random live internet-radio stations across lo-fi, rock and 2000s/pop tags.
- Direct HTTPS MP3 audio streams from the Radio Browser directory; no YouTube player, account, API key, or separate music files.
- Host selects the station and shared start timestamp; station, mute state and changes are relayed to the guest through the existing room connection.
- Recent-word cache uses `sessionStorage` on the host browser and clears when the browser tab/session is closed.

## Files
- `hinthappen_index.html` is the canonical game source.
- `index.html` is a tiny GitHub Pages entry redirect to the canonical file.
- `.github/workflows/pages.yml` deploys the static site to GitHub Pages.

## Radio provider
Radio Browser is a free, community-maintained station directory with a public JSON API and no account/API key. The game queries the directory directly from the browser, filters for stations marked working, HTTPS and MP3, and selects a random station. The media itself plays from the station's own stream server; Radio Browser does not host the music.

Live radio is continuous broadcast audio, not individual song files. The same station and scheduled start timestamp are shared across both phones. Startup/buffering differences between devices and networks mean playback alignment is best-effort, not sample-accurate. Station quality, availability, music selection, territory restrictions and broadcaster licensing are controlled by each station.

The app sends the directory only a genre/tag search. It does not send the room code, player names, guesses or scores to Radio Browser. The host sends the guest only the selected station's sanitized name, genre, HTTPS stream URL and shared radio state over the existing peer room connection.

## Run and deploy
Open `index.html` on the deployed site. To deploy, set repository Settings → Pages → Source to **GitHub Actions**. Pushing changes to `hinthappen_index.html` or `index.html` on `main` triggers the workflow.

## Limitations
- Radio Browser is provided without an uptime guarantee; the game tries its documented mirrors and can skip failed stations.
- The browser may require a tap on each phone before it permits audio playback. The volume is capped at 16% in the UI.
- This is a static client app. PeerJS signaling and each station's streaming service remain third-party network dependencies; no private server, root access, game API key or additional app secret is configured.
- Real two-phone playback and device/network testing is still needed after deployment.
