# Supabase RLS & Data Sync Integrity

When building applications that save data to Supabase from the client-side (especially admin panels or data management modals):

1. **Verify RLS Policies**: If the app uses the `anon` public key to insert, update, or delete data without user authentication, you MUST ensure that the corresponding Row Level Security (RLS) policies on the Supabase tables are configured to allow anonymous operations. Alternatively, RLS must be temporarily disabled for that table.
2. **Never Swallow Errors**: If a Supabase mutation (`insert`, `upsert`, `update`, `delete`) fails (e.g., due to RLS violation), the error MUST be explicitly surfaced to the user in the UI with a clear error message (e.g., `alert()` or a prominent toast). Do not allow the UI state to update optimistically if the backend save fails.
3. **Keep Source of Truth Synchronized**: Ensure that if the database save fails, `localStorage` or other local caching mechanisms are NOT updated out-of-sync with the failed database state, to prevent confusion on page reloads.
