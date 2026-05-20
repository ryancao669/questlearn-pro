# Allow matt@collegeboundnow.com to log in as admin

## What changes

Update the `handle_new_user` database trigger so that when `matt@collegeboundnow.com` signs in for the first time (via Google or magic link), they are automatically granted the **super_admin** role — same setup you (`rc92157@student.musd.org`) already have.

That means Matt will be able to:
- Log in from the public site with either Google or a magic link
- See data across all schools (currently just Milpitas High)
- Be unaffected by per-school tenant isolation

He will **not** be tied to any school (since `collegeboundnow.com` isn't a registered school domain), so no `student_progress` row gets created for him — he's purely an admin observer, not a student. That's the right setup for personal testing.

## Why this approach

- Mirrors the existing pattern for your own account — one-line addition to the trigger's allowlist.
- No schema changes, no new tables, no frontend changes.
- If Matt later needs to act as a student inside a specific school instead, we just add `collegeboundnow.com` to that school's `allowed_email_domains` and remove the super_admin grant.

## Technical detail

Single migration: edit `handle_new_user` so the final `IF` block matches either email:

```sql
IF lower(NEW.email) IN ('rc92157@student.musd.org', 'matt@collegeboundnow.com') THEN
  INSERT INTO public.user_roles (user_id, role, school_id)
  VALUES (NEW.id, 'super_admin', NULL)
  ON CONFLICT DO NOTHING;
END IF;
```

If Matt has already signed up before this runs, we'll also insert his super_admin role directly so he doesn't need to re-register.

## Out of scope

- Building an `/admin` UI (the super_admin role today just unlocks broader RLS reads via the Cloud dashboard and any future admin pages).
- Adding collegeboundnow.com as a school tenant.

Confirm and I'll ship it.
