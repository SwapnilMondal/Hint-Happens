# Hint Happens — Supabase Chat Moderation Setup

This adds **server-side chat moderation**. Messages are sent to a Supabase Edge Function first; filtered messages are rejected and never forwarded by PeerJS. The Supabase function is the moderation source of truth.

## 1) Create a Supabase project
- Create a Supabase project and copy Project URL and the public anon key.
- In Authentication → Providers / Sign In, enable **Anonymous sign-ins** (anonymous users are used by the game and dashboard).
- Enable Edge Functions.

## 2) Create tables and retention job
- Open SQL Editor.
- Paste and run `supabase/schema.sql`.
- The schema schedules a daily purge at 03:15 UTC; expired chat, moderation events, and IP/name records are deleted after 10 days.
- Confirm the pg_cron extension is available and the schedule is present.

## 3) Deploy the Edge Function
Deploy `supabase/functions/moderate-chat/index.ts` as `moderate-chat` (Supabase CLI from the repository root):
```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy moderate-chat
``
Set function secrets (service-role key remains server-side only):
```sh
supabase secrets set SUPABASE_URL="https://YOUR_PROJECT.supabase.co" SUPABASE_ANON_KEY="YOUR_PUBLIC_ANON_KEY" SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
``
Do **not** put the service-role key in the HTML or expose it to players.

## 4) Configure the browser client
Edit `hinthappen_index.html` near the moderation constants and replace:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

The page has fail-closed chat behavior: if Supabase is not configured, moderation cannot authenticate, or the moderation function is unavailable, chat sending is disabled rather than falling back to unmoderated PeerJS chat. The rest of the game remains playable.

## 5) Grant moderation dashboard admin
1. Open `moderation.html` from the deployed site.
2. Enter the project URL + anon key, click **Sign in**.
3. In Supabase Dashboard → Authentication → Users, find the new anonymous user ID.
4. In SQL Editor run (replace UUID):
```sql
insert into public.moderation_admins(user_id) values ('YOUR_AUTH_USER_UUID');
```
5. Return to the dashboard and click **Load data**.

Admin access is checked on the server for every dashboard and filter-list write request. An anonymous account is not automatically an admin.

## Moderation data
- **Chat filter:** server-side word/phrase matching; blocked submissions are not stored in the chat table and never forwarded to the other peer.
- **Counters:** each blocked submission creates a moderation event with the matched terms and number of flagged occurrences; dashboard aggregates flagged occurrences and event totals per display name for the rolling retention period.
- **Term list:** add words or phrases and toggle filters in the dashboard.
- **Logs:** login/attempts retain display name, room, excerpt, matched terms, counts, timestamp, and IP in a protected database table.
- **Retention:** data is scheduled to expire after 10 days. Confirm the cron job runs; SQL cron schedule runs daily, so records can remain a little beyond 10 days until the next purge.

## Privacy / operational notes
- Display names are user-entered and are not unique identities. Anonymous auth user IDs are the pseudonymous identifier.
- IP addresses are personal data. The app tells players that name/IP moderation logs are retained for up to 10 days; consider adding a consent checkbox/notice before they enter a room and publish a short privacy notice.
- Initial seeded terms are illustrative. Customize and test for your audience and local languages, slang, obfuscation, and false positives.
- This implementation does not currently rate-limit messages or offer an appeals/moderation queue. Add rate limiting before wider public use.
- Supabase Edge Functions may have provider-level request/IP logs with their own retention settings; the SQL purge only controls the tables above.
