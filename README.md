# Hint Happens!

A mobile-first two-player browser word game. Open the link on two phones; no app installation is required.

## Match rules
- **5 rounds per match.**
- In each round, Player 1 guesses **5 words** while Player 2 gives clues.
- Then the game displays **“Now [Player 2]!”** and the roles switch: Player 2 guesses 5 words while Player 1 gives clues.
- That is **10 words per round and 50 words per full match**.
- The player who solves more of their five words wins that round. Most round wins after five rounds wins the match; a tied round awards neither player a round win.
- Each word has a 60-second timer. Wrong guesses reveal random letters; revealing 60% or more ends that word.
- Players enter their own names, and the names appear in turn prompts and the scoreboards.

## Rooms and joining
- The host creates a fresh 10-character room ID with browser Web Crypto when available.
- The game creates a shareable invite URL such as `/?room=ROOMCODE`. It opens the game with that room code prefilled, so the second player only needs to enter their name and tap Join.
- PeerJS provides the two-phone connection. Anyone who receives an active invite URL can attempt to join, so share it only with the intended player.

## Word decks
- `word-decks.json` contains **1,000 distinct entries in each of seven categories (7,000 total)**: Animals, Countries & Regions, Food, Places, Movies, Music, and Sports.
- The game loads this static JSON file from the same GitHub Pages site. Word selection does not require a word API, login, key, or a third-party data request during a match.
- Difficulty changes clue style: Easy clues are more direct; Mixed clues balance hints with playful prompts; Hard clues use more oblique, puzzle-like hints.
- A match draws 50 words from the selected categories. Recently used words are cached in the host's browser session to reduce repeats across matches in that same session.
- Optional custom-word mode replaces the standard deck and requires at least 50 unique entries.

### Data-source notes
The repository's `word-decks.json` includes the category-level source notes. The word pools are compiled from public word lists and datasets, combined with the original game's vocabulary and additional curated terms. They are normalized and de-duplicated for gameplay. Some lists include broad taxonomic names, administrative regions, culinary terms, musical styles, and sports vocabulary to build variety. They are not a definitive taxonomy or official reference list.

Source notes currently include:
- Animal names: `jneidel/animal-names` plus the original game list.
- Countries and regions: `country-regions/country-region-data` and `dr5hn/countries-states-cities-database`.
- Places: `russ666/all-countries-and-cities-json` plus original landmarks.
- Food: USDA-derived CalorTracker food names (CC0), Food-101 names, other food lists, and curated additions.
- Movies: MovieLens 1M titles plus original game titles.
- Music: `voltraco/genres` plus original game music terms.
- Sports: `clem9669/wordlists`, original game terms, and curated additions.

## Radio
- The radio controls use the free Radio Browser station directory to find HTTPS MP3 streams tagged Lo-fi, Rock, or Pop/2000s.
- The same 📻 icon is always shown; mute state is represented with a diagonal cross over the icon.
- Station and playback state are relayed through the existing room connection. Both phones receive the selected station and a scheduled start time; network buffering makes exact synchronization best-effort.
- The radio is a live broadcast, not a song catalog. Each station controls its own content, availability, licensing, and territory restrictions.
- Browser audio may require a user tap before playback. The app sets radio volume to 16%.

## Files
- `hinthappen_index.html` — canonical game.
- `index.html` — GitHub Pages entry redirect; preserves the invite query string.
- `word-decks.json` — static 7-category word library.

## Run and deploy
Open `index.html` on the published site. In repository Settings → Pages, use **GitHub Actions** as the deployment source. GitHub Pages runs its Pages-managed build and deployment when the repository content changes.

## Privacy and external services
- No game account, private backend, database, radio API key, or root access is used.
- Radio Browser receives genre/tag station-discovery requests, not room codes, player names, guesses, or scores.
- PeerJS handles room signaling/data exchange between the two phones. The radio stream provider receives a normal audio-stream connection from each phone.
- As with ordinary web services, these external services can receive network metadata such as IP address and browser headers.

## Answer celebrations and winner
- When a guess is correct, the host sends one playful pop-culture/pun celebration with the answer in the `wordResult` message, so both players see the same celebration.
- At match end, both screens show the winner banner: **“Are you taking the Hint?! You’re the winner, [Player name]!”**; ties get a separate playful tie message.
