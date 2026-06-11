# Google Sheets Live Sync + Vercel Deployment

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the local CSV file fetch with a live Google Sheets feed, served through a Vercel serverless proxy, and deploy the dashboard to Vercel so it's accessible from any browser.

**Architecture:** A new `api/data.js` Vercel serverless function fetches the public Google Sheets CSV export server-side (bypassing CORS) and returns the text to the browser. `index.html` is updated to call `/api/data` instead of the local CSV filename, and the refresh interval is changed to 10 minutes.

**Tech Stack:** Vercel serverless (Node.js 18+), vanilla JS, no build step, static HTML served from repo root.

---

## File Map

| Action | File | What changes |
|--------|------|--------------|
| Create | `api/data.js` | New serverless proxy function |
| Create | `vercel.json` | Tells Vercel: no framework, serve from root |
| Modify | `index.html` lines 84–98 | `CSV_FILENAME` → `/api/data`, `REFRESH_MS` → 10 min |

---

## Task 1: Create the serverless proxy function

**Files:**
- Create: `api/data.js`

- [ ] **Step 1: Create the `api/` directory and `data.js`**

Create `/Users/rajatlal/Documents/SalarySe/LeaderBoard/api/data.js` with this exact content:

```js
module.exports = async function handler(req, res) {
  const url =
    'https://docs.google.com/spreadsheets/d/1u4AE43ko-mIGWMkBIwI9-qoYmJ_sjbBI2BCcr0U5OXM/export?format=csv&gid=0';
  try {
    const upstream = await fetch(url);
    if (!upstream.ok) throw new Error(`sheets ${upstream.status}`);
    const text = await upstream.text();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.status(200).send(text);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};
```

- [ ] **Step 2: Verify the file exists**

```bash
cat /Users/rajatlal/Documents/SalarySe/LeaderBoard/api/data.js
```

Expected: the file prints with the handler code above.

- [ ] **Step 3: Commit**

```bash
cd /Users/rajatlal/Documents/SalarySe/LeaderBoard
git add api/data.js
git commit -m "feat: add vercel serverless proxy for google sheets csv"
```

---

## Task 2: Add vercel.json

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create `vercel.json`**

Create `/Users/rajatlal/Documents/SalarySe/LeaderBoard/vercel.json` with this exact content:

```json
{
  "framework": null,
  "outputDirectory": "."
}
```

`framework: null` tells Vercel this is a plain static site with no build step. `outputDirectory: "."` means serve files from the repo root.

- [ ] **Step 2: Commit**

```bash
cd /Users/rajatlal/Documents/SalarySe/LeaderBoard
git add vercel.json
git commit -m "feat: add vercel config for static site + api"
```

---

## Task 3: Update index.html — point to `/api/data` and set 10-min refresh

**Files:**
- Modify: `index.html` lines 83–98

- [ ] **Step 1: Replace the CSV fetch block**

In `index.html`, find this block (around lines 83–98):

```js
    // CSV filename to try auto-fetching when served via HTTP
    const CSV_FILENAME = "New CUB YTD Analysis April'26-Jun'26 - Conversions.csv";
    const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

    let csvText = null;
    let csvMeta = { monthLabel: '', asOf: '' };

    async function tryFetchCSV() {
      try {
        const res = await fetch(encodeURIComponent(CSV_FILENAME));
        if (!res.ok) throw new Error('fetch failed');
        return await res.text();
      } catch {
        return null;
      }
    }
```

Replace it with:

```js
    const REFRESH_MS = 10 * 60 * 1000; // 10 minutes

    let csvText = null;
    let csvMeta = { monthLabel: '', asOf: '' };

    async function tryFetchCSV() {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('fetch failed');
        return await res.text();
      } catch {
        return null;
      }
    }
```

Changes: removed `CSV_FILENAME`, changed fetch target to `/api/data`, changed `REFRESH_MS` to 10 minutes.

- [ ] **Step 2: Verify the change**

```bash
grep -n "CSV_FILENAME\|REFRESH_MS\|tryFetchCSV\|api/data" /Users/rajatlal/Documents/SalarySe/LeaderBoard/index.html
```

Expected output — `CSV_FILENAME` should NOT appear, and you should see:
```
85:    const REFRESH_MS = 10 * 60 * 1000; // 10 minutes
92:        const res = await fetch('/api/data');
```

- [ ] **Step 3: Commit**

```bash
cd /Users/rajatlal/Documents/SalarySe/LeaderBoard
git add index.html
git commit -m "feat: fetch live data from /api/data, refresh every 10 min"
```

---

## Task 4: Create GitHub repo and push

- [ ] **Step 1: Create `.gitignore` to exclude the CSV (contains phone numbers)**

Create `/Users/rajatlal/Documents/SalarySe/LeaderBoard/.gitignore` with this content:

```
*.csv
```

This prevents the local Conversions CSV (which contains agent phone numbers) from being committed to the public GitHub repo. The dashboard will use `/api/data` (Google Sheets) in production.

```bash
cd /Users/rajatlal/Documents/SalarySe/LeaderBoard
git add .gitignore
git commit -m "chore: ignore csv files (contain pii)"
```

- [ ] **Step 2: Initialise git if not already a repo**

```bash
cd /Users/rajatlal/Documents/SalarySe/LeaderBoard
git status
```

If it says "not a git repository", run:
```bash
git init
git add .
git commit -m "feat: initial commit — cub telesales live tracker"
```

If it already shows commits, skip this step.

- [ ] **Step 2: Create the GitHub repo**

```bash
gh repo create cub-leaderboard --public --source=. --remote=origin --push
```

This creates the repo on GitHub, sets it as `origin`, and pushes all commits.

Expected output ends with something like:
```
✓ Created repository rajatlal/cub-leaderboard on GitHub
✓ Pushed commits to https://github.com/rajatlal/cub-leaderboard.git
```

- [ ] **Step 3: Verify remote is set**

```bash
git remote -v
```

Expected:
```
origin  https://github.com/rajatlal/cub-leaderboard.git (fetch)
origin  https://github.com/rajatlal/cub-leaderboard.git (push)
```

---

## Task 5: Deploy to Vercel and verify

- [ ] **Step 1: Link and deploy via Vercel CLI**

```bash
cd /Users/rajatlal/Documents/SalarySe/LeaderBoard
npx vercel --yes
```

Vercel will auto-detect the GitHub repo and deploy. When prompted for settings, accept all defaults (framework: Other, root: `.`).

Expected: a preview URL like `https://cub-leaderboard-xxxx.vercel.app`

- [ ] **Step 2: Test the proxy endpoint**

Replace `<your-preview-url>` with the URL from the previous step:

```bash
curl -s "https://<your-preview-url>/api/data" | head -3
```

Expected output (first 3 lines of the sheet):
```
Date,Phone Number,vKYC Status,RM,Card
1-Apr-2026,...
```

- [ ] **Step 3: Open the dashboard in a browser**

Open `https://<your-preview-url>/index.html` in a browser.

Expected: dashboard loads with live agent data, no file upload overlay shown.

- [ ] **Step 4: Promote to production**

```bash
npx vercel --prod
```

Expected: a permanent URL like `https://cub-leaderboard.vercel.app`

- [ ] **Step 5: Set up auto-deploy from GitHub (one-time, in Vercel UI)**

1. Go to vercel.com → your project → Settings → Git
2. Confirm the GitHub repo `cub-leaderboard` is connected
3. From now on, every `git push` to `main` auto-deploys — no CLI needed

---

## Updating data going forward

When new conversions are added to the Google Sheet, the dashboard auto-updates within 10 minutes (the Vercel CDN cache is 60 seconds, the browser polls every 10 minutes). No deploy needed — the sheet IS the data source.
