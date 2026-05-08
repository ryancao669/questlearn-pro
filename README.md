# Cash Quest

A gamified financial-literacy platform for high school students. Students complete short lessons, earn Knowledge Points and Redeemable Points, and trade those points for real classroom rewards.

Created by **Ryan Cao** at **Milpitas High School**.

## Multi-tenant by design

Cash Quest is built as a platform: each school is a tenant with its own students, leaderboard, and (eventually) teacher view. The database physically isolates one school's data from another via Row-Level Security — even a compromised frontend cannot leak data across schools.

## Authentication

Sign-in uses passwordless magic links restricted to a school's email domain. No passwords, no shared secrets, no risk of password reuse spilling into school accounts.

## Tech stack

- React 18 + Vite + TypeScript + Tailwind
- Lovable Cloud (Supabase) for database, auth, and RLS
- shadcn/ui components

## Local development

```bash
cp .env.example .env   # values are auto-populated when running on Lovable
npm install
npm run dev
```

## License

Currently **All Rights Reserved** — see [LICENSE](./LICENSE). Attribution requirements are documented in [NOTICE](./NOTICE).

A more permissive open-source license may be applied in the future.
