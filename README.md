# Jamia Usmania Sabera Mission — Institute Web App

A complete, lightweight institute website: multi-page frontend (HTML5 + CSS3 + vanilla JS) with a
Node.js/Express backend used **only** to keep the Gemini API key secure on the server.

Built mobile-first for low-end phones and slow networks: no frameworks, no external fonts,
no heavy images (all images are small SVGs, 0.6–5 KB each).

---

## Folder structure

```
institute-app/
├── index.html          Home — hero slider, announcements ticker, highlights, stats
├── about.html          History, mission, values, faculty, facilities
├── courses.html        Course list with fees, duration, seats + filters
├── admission.html      Admission enquiry form with validation
├── gallery.html        Photo gallery + lightbox, upcoming events
├── contact.html        Contact info, map, contact form
├── admin.html          Admin login + enquiries/messages dashboard
├── css/
│   └── style.css       Single stylesheet (design system in :root variables)
├── js/
│   ├── data.js         ← EDIT THIS: courses, fees, events, announcements, gallery
│   ├── main.js         Nav, slider, ticker, validation, localStorage, chat widget
│   └── admin.js        Admin login, dashboard, CSV export
├── images/             SVG logo, hero slides, gallery placeholders
└── server/
    ├── server.js       Express: static hosting + /api/assistant (Gemini proxy)
    ├── package.json
    ├── .env.example
    └── .gitignore
```

## Quick start (frontend only)

No build step. Open `index.html` directly in a browser, or serve the folder:

```bash
# from the institute-app folder — any static server works
npx serve .
```

Everything works offline except the AI chat widget (needs the server below) and the
OpenStreetMap embed on the contact page.

## Quick start (with the AI assistant server)

The chat widget ("Ask Jamia Assistant") calls `POST /api/assistant`. The Express server
keeps your Gemini key on the server side — the key is **never** in the frontend code.

```bash
cd server
npm install
cp .env.example .env        # Windows: copy .env.example .env
# edit .env and paste your Gemini API key (get one free at https://aistudio.google.com/apikey)
npm start
```

Open http://localhost:3000 — the whole site is served from the same server, and the chat
widget now works. Health check: http://localhost:3000/api/health

## Admin panel

Go to `admin.html` (or the "Admin Login" link in the top bar / footer).

- **Demo credentials:** username `admin`, password `admin123`
- Change the password from the dashboard → Settings tab after first login.
- Enquiries submitted through `admission.html` and messages from `contact.html` appear here.
- You can: search, change enquiry status (new → contacted → admitted → closed), view full
  details, delete records, and export all enquiries to CSV.

## Where things are stored (important!)

Enquiries, messages and admin credentials are stored in the **browser's localStorage**.
That means:

- Data is per-browser and per-device — the admin sees only enquiries submitted on that
  device/browser.
- Clearing browser data deletes them.

This matches "step 3" of the learning path (store form data in localStorage, read it from
an admin page). For real persistence, see "Next steps" below.

## Customising content

| What                    | Where                                            |
|-------------------------|--------------------------------------------------|
| Courses, fees, seats    | `js/data.js` → `courses`                         |
| Announcements ticker    | `js/data.js` → `announcements`                    |
| Upcoming events         | `js/data.js` → `events`                          |
| Gallery photos/captions | `js/data.js` → `gallery` (drop photos in `images/`) |
| Phone, email, address   | `js/data.js` → `contact`, plus the page footers  |
| Colours / theme         | `css/style.css` → `:root` variables              |
| AI assistant knowledge | `server/server.js` → `SYSTEM_PROMPT`              |

All phone numbers, the address, email, faculty names, history text and stats are
**placeholders** — replace them with the institute's real details before going live.
Gallery images are SVG placeholders; put real photos (JPG/WebP, compressed) in `images/`
and update `js/data.js`.

## Next steps (when you want real persistence & logins)

This project deliberately follows the suggested learning path:

1. ✅ Mobile menu + image slider (home page)
2. ✅ Admission form with validation
3. ✅ localStorage + small admin page that displays enquiries
4. ▶ Real backend: move `/api/assistant`'s pattern further —

   - Add a database (SQLite/PostgreSQL/MongoDB Atlas) and POST endpoints such as
     `/api/enquiries`; make the forms save there instead of localStorage.
   - Replace the demo admin login with real server-side sessions (e.g. express-session +
     bcrypt password hashing, or a managed auth provider).
   - The AI proxy is already structured the right way for this: server holds the secret,
     frontend calls the server.

## Security notes

- Keep `GEMINI_API_KEY` only in `server/.env` (already gitignored). Never paste it into
  any `.html`/`.js` frontend file — anyone viewing the page source could steal it.
- The admin login here is a **demo** (credentials in localStorage). Do not use it as-is
  on a public site.
- The server rate-limits `/api/assistant` (30 requests/minute/IP) so one visitor cannot
  burn through your Gemini quota.

## Deploying

- **Frontend only** (no AI chat): any static host — GitHub Pages, Netlify, Vercel,
  Cloudflare Pages. Just upload the files (you can skip the `server/` folder).
- **With the AI server**: any Node host — Render, Railway, Fly.io, or a small VPS. Set the
  `GEMINI_API_KEY` environment variable in the host's dashboard, run `npm install` and
  `npm start` in `server/`. Note: most free tiers are HTTPS, which is also required for
  the camera/geolocation-style browser APIs — not used here, but good practice.
