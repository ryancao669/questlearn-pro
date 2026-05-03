
# Phase 1 Build Plan: Multi-Tenant Cash Quest

This plan replaces all `localStorage` mocks with a real backend, while baking school-level multi-tenancy in from day one. Branding stays uniform; only the school *name* varies. Auth uses magic links routed by email domain. The repo gets prepped for open-sourcing later without committing to it now.

---

## 1. The mental model

Cash Quest becomes a **platform**. Each school is a **tenant**. Every piece of student data is stamped with a `school_id`, and the database physically refuses to return one school's data to another school's user. Milpitas High is just the first tenant.

```text
            Cash Quest Platform
           /         |          \
        MHS        Lincoln HS   Berkeley HS
       /   \         |             |
   students teacher students    students
```

You are the **platform owner** (super-admin). Each school has one or more **school admins** (e.g., a teacher you trust). Students only ever see their own school.

---

## 2. What gets built

### A. Database (Lovable Cloud / Supabase)

Six tables, all with Row-Level Security on:

- **`schools`** — one row per school. Holds `name`, `slug` (e.g. `mhs`), and `allowed_email_domains` (e.g. `["students.musd.org"]`). This list is what routes a magic-link signup to the right tenant.
- **`profiles`** — one row per authenticated user, linked to `auth.users`. Holds `school_id`, `display_name`, optional `student_id_number`.
- **`user_roles`** — separate table (never on profiles — security best practice). Roles: `super_admin`, `school_admin`, `teacher`, `student`. Scoped by `school_id` except for `super_admin`.
- **`student_progress`** — replaces the `cashquest-progress` localStorage blob. One row per student: `knowledge_points`, `redeemable_points`, `current_streak`, `last_completed_date`.
- **`lesson_completions`** — one row per (student, lesson). Holds `quiz_score`, `completed_at`. Source of truth for "which lessons are done."
- **`reward_redemptions`** — one row per redemption. Holds `reward_id`, `cost`, `redeemed_at`, `fulfillment_status`.

### B. Authentication: magic link, domain-routed

- Login page asks only for an email address.
- On submit, the system looks up `allowed_email_domains` across all schools. If the domain matches exactly one school, it sends a magic link and pre-binds the new profile to that `school_id`. If no match, it shows: *"Cash Quest isn't available at your school yet."*
- First-time users get a profile + `student` role created automatically via a database trigger on `auth.users` insert.
- No passwords, no DOB, no shared secrets. Lost access = request another magic link.

### C. Row-Level Security policies

The rules the database enforces, no matter what the frontend does:

- Students can read/write **only their own** `student_progress`, `lesson_completions`, `reward_redemptions`.
- Teachers and school_admins can read **all rows where `school_id` matches their own school**.
- Super_admins can read everything (for support).
- Cross-school reads are physically impossible — even a compromised frontend can't leak data across tenants.

A `has_role(user_id, role, school_id)` security-definer function backs the policies (avoids the recursive-RLS pitfall).

### D. Frontend changes

- **`Login.tsx`** — rewritten as a single email input + "Send magic link" button. Removes `STUDENT_DIRECTORY` and DOB.
- **`useProgress.ts`** — same hook signature, but reads/writes Supabase instead of localStorage. Components don't need to change.
- **`Leaderboard.tsx`** — replaces `mockLeaderboard` with a query scoped to the current user's school. Shows the school name in the header (e.g., "Milpitas High Rankings") pulled from the `schools` table.
- **`AppNavbar.tsx`** — adds a small school name label next to the Cash Quest logo. Branding (colors, logo, name "Cash Quest") stays identical everywhere.
- **`Index.tsx`** — pulls `display_name` from the profile instead of the mock directory. Removes ID photo (it was a mock anyway and we're not collecting school-issued data).

### E. Account maintenance (your question about fixing accounts)

Three layers, in order of how often you'd use them:

1. **Self-service (90% of cases)** — student requests a new magic link. Solves "I can't log in."
2. **Cloud dashboard (9% of cases)** — you open Lovable Cloud → Users, find the account, can delete/disable/resend invite. Same for editing rows in `profiles` or `student_progress`. No code or CSV editing required.
3. **Tiny admin page (1% of cases, built later if needed)** — a `/admin` route visible only to `super_admin` and `school_admin` roles, for actions like "reset this student's progress" or "remove a student from the class." Not part of Phase 1; mentioning so you know the path.

You will **not** need to edit CSVs or use Lovable to fix accounts. The Cloud dashboard handles it.

### F. Repo hygiene for "maybe open-source later"

Without committing to OSS now, we add the things that are annoying to add retroactively:

- **`LICENSE`** — placeholder marked "All Rights Reserved, © Ryan Cao 2026." Easy to swap to MIT/Apache-2.0 + attribution clause later.
- **`README.md`** — proper project description, attribution line ("Created by Ryan Cao at Milpitas High School"), screenshot, setup instructions.
- **`NOTICE`** file — names you as original author. Standard mechanism for preserving attribution even under permissive licenses.
- **No school-specific hardcoding** — "Milpitas High" never appears in code; it's a row in the `schools` table. This is what makes future forks (or new tenants on your hosted version) trivial.
- **`.env.example`** — documents required environment variables so a future contributor can run it locally.

When you're ready to open-source, the decision becomes: pick a license, flip the GitHub repo to public. That's it.

---

## 3. Seed data

On first deploy, the migration inserts:

- One row in `schools`: `{ name: "Milpitas High School", slug: "mhs", allowed_email_domains: ["students.musd.org"] }` *(replace with the real domain when you confirm it)*
- Your account (`rcao@students.musd.org`) gets the `super_admin` role so you can manage everything.

---

## 4. What's explicitly out of scope for Phase 1

Saving for Phase 2 (per your call): teacher dashboard, class rosters, assignment due dates, anti-cheat auto-submit signals, classroom analytics. The schema we're building today already supports them — we just don't build the UI yet.

---

## 5. Technical details (skip if not interested)

- **Stack additions**: `@supabase/supabase-js` is already implied by Lovable Cloud. Adding `@tanstack/react-query` mutations for writes (already in deps).
- **Migrations**: one SQL migration creates all tables + RLS policies + the `has_role` function + the `handle_new_user` trigger.
- **Tenant resolution**: a `useCurrentSchool()` hook reads `profile.school_id` once on login and caches it in React Query. All subsequent queries filter by it implicitly via RLS — frontend doesn't need to pass `school_id` manually.
- **Magic link redirect**: configured to `window.location.origin` so it works in preview, custom domain, and any future fork.
- **`student_id_number` field** is optional and self-entered (not verified against a school roster). Used only for display on the profile card. No connection to the school's SIS.

---

## 6. Open questions before I build

1. **The email domain** — what's the exact student email domain at MHS? (`students.musd.org`? `musd.org`? Something else?) I need it for the seed row.
2. **Your super_admin email** — confirm `rcao@students.musd.org` (or give me the right one) so the migration grants you super_admin on first login.
3. **Display name** — should new students be prompted to enter their name on first login, or should we derive it from the email (e.g. `rcao` → "Rcao") and let them edit later? The second is faster; the first looks nicer.

Once you answer those three, I'll switch to build mode and ship it.
