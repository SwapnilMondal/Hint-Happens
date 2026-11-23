# Hint Happens!

A mobile-first two-player browser word guessing game. No app install is required.

## Features
- Seven word categories; themed colors and clues.
- 5/10 rounds, difficulty modes, custom words, 60-second rounds, random letter reveals and scoring.
- PeerJS room-based two-phone play.
- Synthesized game sound effects.
- Radio dock: low-volume YouTube embedded radio streams/mix, play/mute toggle and random next station. Host selects and relays station/time state to the guest. Guests may need to tap Radio once to satisfy browser autoplay restrictions.
- Word history: the host browser stores recent words in sessionStorage, up to 10 match sessions. It clears when the browser tab/session is closed, not on game exit.

## Run
Open index.html in a modern mobile browser. Internet is required for PeerJS and YouTube embeds.

## Deploy
The GitHub Actions workflow in .github/workflows/pages.yml deploys the static site when index.html changes on main. Set repository Settings → Pages → Source to GitHub Actions if needed.

## Radio notes
YouTube is embedded in its player (no separate music files are downloaded by this game). YouTube still loads its player/video and may show ads, apply restrictions, collect its normal usage data, and block playback depending on the device/browser. The selected live streams will align by live broadcast, but a YouTube auto-generated Mix can vary across accounts and may not be perfectly synchronized after its initial track.

## Testing
JavaScript syntax checked with Node. Two-phone peer connection and radio playback/synchronization require live device testing.
