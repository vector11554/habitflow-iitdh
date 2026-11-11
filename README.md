# HabitFlow — IIT Dharwad

A responsive habit-building web app for the IIT Dharwad community. Built with Next.js, TypeScript, Supabase Auth/Postgres and Tailwind CSS.

## Included features

- IIT Dharwad email-only sign-in using Supabase email magic links.
- Nickname onboarding; the dashboard greets the user by nickname.
- Private user profiles, habits and habit logs.
- Daily and weekly-target habits.
- Daily check-off with saved completion.
- Habit archive.
- 28-day activity calendar.
- Seven-day completion insights.
- Responsive desktop sidebar and mobile navigation.
- Security headers and database Row Level Security policies.

## Before you start

You need:
- A computer with Node.js 20.9+ and Git installed.
- A GitHub account.
- A Supabase account.
- A Vercel account.
- Access to an `@iitdh.ac.in` mailbox for testing.

This project is a strong student-project foundation, not a security certification. Before inviting the whole campus, test it with a small group and review the deployment checklist below.

---

# Part A — Run it locally

## 1. Install Node.js and Git

Install the current Node.js LTS release from https://nodejs.org/ and Git from https://git-scm.com/downloads.

On Ubuntu, verify:

```bash
node -v
npm -v
git --version
```

Use Node.js 20.9 or newer.

## 2. Unzip and open the project

```bash
cd ~/Downloads
unzip habitflow-iitdh.zip
cd habitflow-iitdh
```

If you extracted it elsewhere, `cd` into that folder instead.

## 3. Install packages

```bash
npm install
```

## 4. Create a Supabase project

1. Visit https://supabase.com/ and create a project.
2. Choose a strong database password and store it in a password manager.
3. Select a region close to India if available.
4. Wait for the database to finish provisioning.
5. Open **Project Settings → API** (or API Keys, depending on the current dashboard).
6. Copy the Project URL and the publishable/anon key. Do not copy or use the service-role/secret key in this app.

## 5. Create the database

1. In Supabase, open **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this project.
3. Copy the entire file into the SQL Editor.
4. Click **Run**.
5. Confirm that `profiles`, `habits`, and `habit_logs` exist under **Table Editor**.

The SQL creates Row Level Security policies. These policies are essential: they ensure a signed-in user can only access rows belonging to their own account.

## 6. Configure email authentication

In Supabase:
1. Open **Authentication → Providers → Email**.
2. Enable email sign-in.
3. Keep email confirmation enabled.
4. Configure the email template so it sends a sign-in link using Supabase's recommended confirmation URL template.
5. Open **Authentication → URL Configuration**.
6. For local development, set Site URL to `http://localhost:3000`.
7. Add `http://localhost:3000/auth/callback` to the Redirect URLs allowlist.

Supabase's built-in email sender has sending limits and is intended for evaluation. For a real campus launch, configure a custom SMTP provider and verify your sender domain. Do not assume the default sender is suitable for high-volume campus traffic.

The app's UI checks the `@iitdh.ac.in` suffix, and the database trigger rejects other email domains. This controls the domain, but it does not prove a person is currently a student or staff member; it proves control of an IIT Dharwad mailbox.

## 7. Add environment variables

Create your local environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Do not add quotes unless the value itself requires them. Never put a service-role key in a `NEXT_PUBLIC_` variable. Never commit `.env.local` to GitHub.

## 8. Start the development server

```bash
npm run dev
```

Open http://localhost:3000.

Test the full flow:
1. Click Get started.
2. Enter your own `@iitdh.ac.in` address.
3. Open the inbox and click the magic link.
4. Choose a nickname.
5. Create a habit.
6. Mark it complete on the dashboard.
7. Open Calendar and Insights.
8. Sign out and sign in again.

If the magic link says the redirect URL is not allowed, revisit Supabase Authentication → URL Configuration and check the exact callback URL.

---

# Part B — Publish it safely

## 9. Create a GitHub repository

From the project directory:

```bash
git init
git add .
git commit -m "Initial HabitFlow IIT Dharwad release"
```

Create a new **private** repository on GitHub, then connect it:

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/habitflow-iitdh.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Keep the repository private while developing. The `.gitignore` excludes `.env.local`.

## 10. Deploy to Vercel

1. Visit https://vercel.com/ and sign in with GitHub.
2. Select **Add New → Project**.
3. Import your `habitflow-iitdh` repository.
4. Keep the detected Next.js settings.
5. Under Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Add them to Production, Preview and Development as appropriate.
7. Click Deploy.
8. Wait for the build to complete and open the generated Vercel URL.

## 11. Configure Supabase for the live URL

After Vercel gives you a domain, for example `habitflow-iitdh.vercel.app`:

1. Supabase → Authentication → URL Configuration.
2. Set Site URL to your production URL.
3. Add `https://YOUR-VERCEL-DOMAIN/auth/callback` to Redirect URLs.
4. If you use a custom domain later, add its callback URL too.
5. Save the changes.
6. Redeploy if you changed environment variables.

Use HTTPS only for the production URL. Vercel provides HTTPS for its hosted domains.

## 12. Production safety checklist

Before sharing the link widely:

- [ ] Email confirmation is enabled.
- [ ] Only `@iitdh.ac.in` accounts can create Auth users (test a non-IITDH address; it must fail).
- [ ] RLS is enabled on all three public tables.
- [ ] Test with two separate IITDH accounts: account A must not see account B's habits, logs or profile.
- [ ] Confirm no service-role/secret key exists in browser code, Git history or Vercel client-side variables.
- [ ] Keep `.env.local` out of GitHub.
- [ ] Use a custom SMTP provider for reliable campus-wide email delivery.
- [ ] Set appropriate Supabase database backups and review retention/restore options.
- [ ] Review Supabase Auth rate limits and abuse protections.
- [ ] Keep dependencies updated and run `npm audit` before releases.
- [ ] Test the site on a phone, keyboard navigation and a screen reader.
- [ ] Publish a short privacy notice explaining what data is stored, why, and how users can request deletion.
- [ ] Decide who administers the project and who responds to security reports.

## 13. Updating the live website

After editing code:

```bash
git add .
git commit -m "Describe your change"
git push
```

Vercel automatically builds and deploys the latest commit from `main`.

---

# Design system

The requested palette is implemented as:

- Deep Graphite: `#20252B` — navigation, hero panels, headings and strong contrast.
- Soft Cloud White: `#F6F7F4` — page background and breathing space.
- Sunshine Yellow: `#F4C84A` — primary buttons, completion states, progress and selected highlights.
- Supporting white: `#FFFFFF` — cards and form surfaces.
- Muted grey: `#737B82` — secondary copy.

Use graphite text on cloud white. Use graphite text on yellow buttons. Avoid small white text on yellow. Colour is never the only indicator of completion; labels and check icons are also used.

The palette and contrast should be checked against WCAG 2.2 AA as the interface evolves.

## Important implementation notes

- The database trigger checks the email domain at Auth-user creation. If you change the allowed institution, update the SQL trigger and server-side checks together.
- The app uses Supabase's public publishable/anon key in the browser. This is expected; Row Level Security is what protects data. A service-role key must never be exposed.
- Weekly habits currently store the target but the dashboard's daily completion action is still a simple daily log. A future iteration should add a weekly progress view and target-aware scheduling.
- Calendar and analytics are deliberately simple first versions.
- Nickname editing, habit stacking, mood check-ins, reminder delivery and account deletion UI are sensible next milestones.
