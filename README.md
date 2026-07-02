# Job Scanner

A mobile-first job-hunting web app for **Millwright** and **Registered Nurse** roles in Ontario, Canada. Built for iPhone — installable to your home screen as a PWA, works offline once cached, and saves your watchlist + tracked jobs locally on your device.

Live results come from [Adzuna's free job-search API](https://developer.adzuna.com/) using **your own** API key. No backend, no AI tokens, no Claude — your data never leaves your phone.

## Features

- **Live job scan** via Adzuna API (Millwright + RN roles, anywhere in Ontario)
- **Quick Links** to Job Bank, Indeed, ZipRecruiter, Glassdoor, and Eluta — no key needed
- **Company watchlist** — flag postings from employers you care about
- **Tracked jobs** with status workflow (Interested → Applied → Interview → Offer → Rejected)
- **iPhone-optimized** — safe-area insets, 44pt touch targets, no zoom-on-focus, haptic feedback
- **Installable PWA** — add to iPhone home screen, launches full-screen like a native app
- **Offline-ready** — app shell cached by service worker; job results need network
- **100% local storage** — your key, watchlist, and tracked jobs live in `localStorage`, never sent anywhere

## Quick Start (3 steps)

### 1. Get a free Adzuna API key (2 minutes)

1. Go to <https://developer.adzuna.com/>
2. Sign up (free) and create a new application
3. Copy your **App ID** and **App Key**

You can use Quick Links without a key — the Adzuna key only unlocks the "Run Live Scan" button.

### 2. Deploy to GitHub Pages (free hosting)

```bash
# from the repo root
git add .
git commit -m "Mobile-optimized PWA: fix storage, add offline support, iPhone home-screen install"
git push origin main
```

Then in GitHub:
1. Open your repo: <https://github.com/Bvpatel1242/Job-Scanner>
2. **Settings → Pages**
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**
4. Set **Branch** to `main` and **Folder** to `/ (root)` → click **Save**
5. Wait 1–2 minutes, then visit:
   `https://bvpatel1242.github.io/Job-Scanner/`

### 3. Install on your iPhone

1. Open the URL above in **Safari** on your iPhone (must be Safari, not Chrome)
2. Tap the **Share** icon (square with up-arrow) at the bottom
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** — the app appears with its own icon and launches full-screen

That's it. Job hunting from your home screen.

## Using the app

1. **Add your Adzuna key** in the Filters panel (saved on device, never uploaded)
2. **Pick a role** (Millwright / RN / Both), **location**, and **radius**
3. Tap **Run Live Scan** — results appear as tickets, watchlisted employers get flagged
4. Tap **+ Track** on any posting to pin it to the Tracked tab
5. Switch to the **Links** tab for one-tap access to Job Bank / Indeed / Glassdoor etc.
6. Switch to the **Tracked** tab to update application statuses

## File structure

```
Job-Scanner/
├── index.html              # The whole app (HTML + CSS + JS, no build step)
├── manifest.json           # PWA manifest (name, icons, theme, display mode)
├── sw.js                   # Service worker (offline cache for app shell)
├── .nojekyll               # Tells GitHub Pages not to run Jekyll
├── .gitignore
├── README.md               # This file
└── icons/
    ├── icon.svg            # Master vector icon
    ├── icon-192.png        # PWA icon (192×192)
    ├── icon-512.png        # PWA icon (512×512)
    ├── apple-touch-icon.png  # iOS home-screen icon (180×180)
    ├── mask-icon.png       # iOS Safari mask icon
    ├── favicon-32.png      # Browser tab icon
    └── favicon-16.png      # Browser tab icon (small)
```

## Privacy

- **Adzuna API key**: stored in `localStorage` on your device only. Sent directly to `api.adzuna.com` when you tap Run Live Scan. Never proxied through any other server.
- **Watchlist + tracked jobs**: stored in `localStorage` on your device only. Never sent anywhere.
- **No analytics, no tracking, no cookies.**

To wipe everything: Safari → Settings → Safari → Advanced → Website Data → find this site → Remove.

## Customizing

- **Add more towns**: edit the `townChips` buttons in `index.html` (just copy a chip line and change `data-town`)
- **Add more roles**: add an entry to the `ROLE_DEFS` object in `index.html` and a matching button in the `roleSwitch`
- **Change default location**: edit the `value` attribute on `#locationInput` and the `data-town` on the default-selected chip
- **Change colors**: edit the `:root` CSS variables at the top of the `<style>` block

## Troubleshooting

**"No key saved yet"** — you haven't added Adzuna credentials. Either add them in the Filters panel, or just use the Quick Links tab.

**"Adzuna error — HTTP 401"** — wrong App ID or App Key. Re-check them at <https://developer.adzuna.com/overview>.

**"Network request failed"** — no internet connection. The app shell still loads offline, but live results need network.

**App not installing on iPhone** — make sure you're using **Safari** (Chrome/Firefox on iOS can't install PWAs). Tap Share → Add to Home Screen.

**Old version showing after an update** — Safari may have cached the old service worker. Hard-refresh by opening Safari, then Settings → Safari → Clear History and Website Data, then re-open.

## Tech notes

- Pure static site — no build step, no dependencies, no npm
- ~1,000 lines of hand-written HTML/CSS/JS in a single file
- Works on any static host (GitHub Pages, Netlify, Vercel, S3, etc.)
- PWA score: installable, offline-ready, mobile-optimized
