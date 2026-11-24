# Hints Happen

A quick two-player word-and-clue game. Open the game on two phones or computers, create a room, and invite your opponent. No player account or sign-in is needed.

## How to play
- A match lasts **5 rounds**.
- Each round, both players take turns guessing **5 words** while the other gives clues (**10 words per round; 50 per match**).
- Each word has **60 seconds**. Wrong guesses reveal random letters; revealing 60% or more ends the word.
- The player who solves more words wins the round. The match winner is the player with the most round wins. A tied round awards neither player a round win.
- Use your own names; they appear in turn prompts and scoreboards.

## Rooms
- Create a room to generate a 10-character code and invite link.
- The second player opens the link or enters the code to join.

## Word decks
`word-decks.json` contains 7,000 words across Animals, Countries & Regions, Food, Places, Movies, Music, and Sports (1,000 entries per category).
- **Easy:** straightforward clues
- **Mixed:** a balance of direct and playful clues
- **Hard:** more indirect, puzzle-style clues
- A full match draws 50 words. The host's browser session tracks recently used words to reduce repeats.
- Custom-word mode replaces the standard deck and requires 50 unique words.

The word pools are compiled from public lists and datasets, then normalized and de-duplicated for gameplay. They are not intended as definitive reference lists. Source notes are included in the word-deck file.

## Radio
- Radio Browser is used to discover live HTTPS stations tagged Lo-fi, Rock, or Pop/2000s.
- Both players share the selected station and scheduled start through the room connection. Exact sync is best-effort due to buffering.
- Audio playback may require a tap. The default volume is 16%.
- Station content, availability, licensing, and territory restrictions are managed by the broadcaster.

## Chat moderation and privacy
- Chat messages are checked server-side before delivery; flagged slurs, profanity, abusive phrases, and adult-content terms are blocked.
- Blocked-message attempts are counted and logged by display name and IP address for up to 10 days.
- The moderation backend is Supabase. See `SUPABASE_MODERATION_SETUP.md` for maintenance details.
- Chat filtering is a blocklist-based filter, not a comprehensive semantic safety classifier.

## Project files
- `hinthappen_index.html` — game interface and logic.
- `index.html` — root redirect that preserves room invite parameters.
- `word-decks.json` — word library.
- `moderation.html`, `supabase/schema.sql`, and `supabase/functions/moderate-chat/index.ts` — moderation dashboard and backend.
- `SUPABASE_MODERATION_SETUP.md` — backend setup and maintenance notes.
