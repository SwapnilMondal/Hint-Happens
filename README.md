# Hint Happens!

A mobile-first two-player browser word guessing game. No app installation, root access, backend deployment, login, or game API key is required.

## Features
- Seven word categories, themed colors/clues, 5/10 rounds, difficulty and custom-word modes.
- 60-second rounds, random letter reveals, scoring, streaks, and synthesized game sounds.
- Two-player rooms via PeerJS. The host generates a fresh 10-character random room-sharing code for each room.
- Radio button + next button: free random live internet-radio stations across lo-fi, rock and pop/2000s tags.
- Direct HTTPS MP3 audio streams from Radio Browser directory; no YouTube player, account, radio API key, or separate music files.
- The host selects a station and future start timestamp; station, mute state and changes are relayed to the guest through the existing room connection.
- Recent-word cache uses `sessionStorage` in the host tab and is cleared when that tab/session is closed.

## Files
- `hinthappen_index.html` is the canonical game source.
- `index.html` is a tiny GitHub Pages entry redirect to the canonical file.
- `.github/workflows/pages.yml` deploys the static site to GitHub Pages.

## Radio provider
Radio Browser is a free, community-maintained radio directory with a public JSON API and no sign-up or API key. The game queries genre tags, requests random ordering, and filters to stations marked working, HTTPS and MP3. Radio Browser is a station directory; it does not host the music. The audio comes directly from each station's stream server. The provider documents the API as free to use but without an uptime guarantee; the game tries multiple mirrors and skips stations whose stream fails. citeturn199524search1turn589618search2turn589618search3

Live radio is continuous broadcast audio, not a track-by-track catalog. Both phones receive the same station and a scheduled start time. Browser/network buffering means playback alignment is best-effort, not sample-accurate. Station music, availability, territory limits and licensing remain controlled by each station.

## Data and security
- No root access, private backend, database credentials, radio API key, or account is used.
- The radio directory receives only genre/tag discovery requests from the app, not room codes, player names, guesses or scores.
- As with any public web request, the directory and selected stream provider can see ordinary connection metadata such as the device's IP address and browser/network headers. The station stream provider receives each phone's stream connection.
- The selected station details and radio controls are sent to the other player over the existing PeerJS room connection. The app does not send game content to the radio directory.
- The room code is generated in the browser using Web Crypto when available. Anyone who obtains the active room code may attempt to join the room, so share it only with the intended player.

## Run and deploy
Open `index.html` on the deployed site. In repository Settings → Pages, set the source to **GitHub Actions**. Pushing changes to `hinthappen_index.html` or `index.html` on `main` triggers deployment.

## Limitations
- A browser may require one tap on each phone before it permits audio playback. The UI sets radio volume to 16%.
- Live stream formats and availability vary. The build currently filters for HTTPS MP3 streams; some stations may not be available from every country or network.
- PeerJS signaling and each station's streaming service remain third-party network dependencies. Real two-phone playback testing is still needed after deployment.
