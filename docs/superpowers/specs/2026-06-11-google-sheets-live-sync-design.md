# Google Sheets Live Sync + Vercel Deployment

**Date:** 2026-06-11  
**Project:** CUB TeleSales Live Performance Tracker  
**Status:** Approved

## Goal

Replace the local CSV file dependency with a live Google Sheets feed so the dashboard is always up to date and accessible from any browser (floor TV, manager desktops) without a locally running server.

## Data Source

A dedicated Google Sheet pulls from the master sheet via IMPORTRANGE and exposes only the 5 columns the dashboard needs: Date, Phone Number, vKYC Status, RM, Card. Any row in this sheet counts as a conversion. The sheet is set to "Anyone with the link can view."

- **Sheet ID:** `1u4AE43ko-mIGWMkBIwI9-qoYmJ_sjbBI2BCcr0U5OXM`
- **CSV export URL:** `https://docs.google.com/spreadsheets/d/1u4AE43ko-mIGWMkBIwI9-qoYmJ_sjbBI2BCcr0U5OXM/export?format=csv&gid=0`

## Architecture

```
Floor TV / Browser
      ↓  fetch("/api/data")
Vercel Serverless Function (api/data.js)
      ↓  fetch(Google Sheets CSV export URL)
Google Sheets (public, read-only)
```

The browser never talks to Google Sheets directly — this avoids CORS restrictions. The Vercel function is the only new infrastructure piece.

## File Changes

### New: `api/data.js`
Vercel serverless function. Fetches the Google Sheets CSV and returns it to the browser with a 60-second CDN cache (`s-maxage=60, stale-while-revalidate`). The cache means Vercel doesn't hit Google on every request, keeping well within Hobby plan limits (~13,000 invocations/month at 10-min refresh across a few tabs).

### New: `vercel.json`
Minimal config telling Vercel the project is a static site served from the root directory. No build step needed.

### Changed: `index.html`
Two changes only:
1. `tryFetchCSV()` — change the fetch target from the local CSV filename to `/api/data`
2. Add a 10-minute auto-refresh interval on mount (silent re-fetch, no spinner, updates numbers in place). 10 minutes chosen to balance freshness against Vercel Hobby plan limits.

The file upload fallback (`<input type="file">`) is retained unchanged for offline/local use.

## Deployment

1. Create a new GitHub repository and push all project files
2. Import the repo into Vercel (one-click via vercel.com dashboard)
3. No environment variables needed — the Sheet is public
4. Every `git push` to main triggers an automatic Vercel deploy

## Error Handling

- If `/api/data` fails (network error, Google Sheets down), the existing error state in `tryFetchCSV()` catches it and shows the file upload overlay — same behaviour as today
- The serverless function returns a non-200 status if the Google fetch fails, so the browser error path fires correctly

## Out of Scope

- Authentication / private sheet support
- Admin panel or manual KYC editing UI
- Custom domain (can be done later in Vercel settings)
