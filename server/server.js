/* ============================================================
   JAMIA USMANIA SABERA MISSION — server.js
   Node.js + Express server.

   Purpose:
   1. Serve the static website (HTML/CSS/JS/images).
   2. Proxy chat requests to the Gemini API so that the API key
      stays ON THE SERVER (never exposed in frontend code).

   Run:
     cd server
     npm install
     cp .env.example .env      (then add your Gemini API key)
     npm start
   ============================================================ */

require('dotenv').config();

const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/* ---------- static site (parent folder of server/) ---------- */
app.use(express.static(path.join(__dirname, '..')));

/* ---------- body parsing ---------- */
app.use(express.json({ limit: '100kb' }));

/* ---------- very simple rate limiting (per IP, in memory) ---------- */
const hits = new Map(); // ip -> { count, resetAt }
function rateLimit(req, res, next) {
  const now = Date.now();
  const ip = req.ip || 'unknown';
  let rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    rec = { count: 0, resetAt: now + 60 * 1000 };
    hits.set(ip, rec);
  }
  rec.count += 1;
  if (rec.count > 30) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }
  next();
}

/* ---------- institute knowledge given to the AI ---------- */
const SYSTEM_PROMPT = `You are the friendly admission assistant of "Jamia Usmania Sabera Mission", a non-profit Islamic institute in Hyderabad, India, founded in 2001, offering combined Islamic and modern education.

Institute facts:
- Courses: Nazra-e-Quran (1 year, age 5+, fee Rs.300/month, 60 seats); Hifz-e-Quran (3-4 years, Rs.500/month, 30 seats, entrance test); Aalim Course / Dars-e-Nizami (6 years, Rs.700/month, 25 seats); Ifta/Mufti Course (2 years, Rs.900/month, 10 seats); Modern Schooling via NIOS up to Class 10 (Rs.400/month); Computer & Vocational Skills (6 months, Rs.600/month).
- One-time admission fees: Rs.500-2000 depending on course. Sibling discount 20%. Zakaat/scholarship support available for deserving students - no child is turned away for lack of means.
- Facilities: masjid, boys' hostel (age 8+, warden care), library, computer lab, dining hall. Girls' section has a separate campus and staff.
- Contact: +91 90000 00000, info@jamiausmania.org, office hours Mon-Sat 8am-4pm. Admissions for 2026-27 are open; entrance tests on Sundays at 10am; session starts 5 April 2027.
- People can apply at /admission.html on this website.

Rules:
- Reply in the same language the user writes in (English, Hindi, Urdu or romanised Urdu/Hinglish).
- Keep answers short (2-4 sentences), warm and respectful. Use "Assalamu alaikum" only if the user greets first.
- Only use the facts above. If asked something you don't know (results, donations account, specific staff), politely ask them to call the office at +91 90000 00000.
- Never invent fees, dates or policies.`;

/* ---------- tiny JSON-over-HTTPS helper (no fetch/WASM dependency) ---------- */
function postJSON(url, body, timeoutMs) {
  return new Promise(function (resolve, reject) {
    const u = new URL(url);
    const payload = JSON.stringify(body);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
      },
      function (res) {
        let raw = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) { raw += chunk; });
        res.on('end', function () {
          let data = null;
          try { data = raw ? JSON.parse(raw) : null; } catch (e) { /* non-JSON body */ }
          resolve({ status: res.statusCode, data: data });
        });
      }
    );
    req.setTimeout(timeoutMs || 20000, function () {
      req.destroy(new Error('Gemini API request timed out'));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/* ---------- API: AI assistant ---------- */
app.post('/api/assistant', rateLimit, async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(501).json({
      error: 'AI assistant is not configured. Add GEMINI_API_KEY to server/.env (see README.md) and restart the server.'
    });
  }

  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message is too long (max 1000 characters).' });
  }

  /* build chat contents from history */
  const contents = [];
  for (const turn of Array.isArray(history) ? history.slice(-8) : []) {
    if (!turn || typeof turn.content !== 'string' || turn.content.length > 2000) continue;
    contents.push({ role: turn.role === 'model' ? 'model' : 'user', parts: [{ text: turn.content }] });
  }
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/' +
      encodeURIComponent(GEMINI_MODEL) +
      ':generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);

    const geminiRes = await postJSON(url, {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 300,
        topP: 0.9
      }
    }, 20000);

    const data = geminiRes.data;

    if (geminiRes.status !== 200) {
      const detail = (data && data.error && data.error.message) || ('Gemini API returned ' + geminiRes.status);
      console.error('[assistant] Gemini error:', detail);
      return res.status(502).json({ error: 'The AI service is temporarily unavailable. Please try again shortly.' });
    }

    const reply =
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts
        .map(function (p) { return p.text || ''; })
        .join('')
        .trim();

    if (!reply) {
      return res.status(502).json({ error: 'The AI service returned an empty reply. Please try again.' });
    }

    res.json({ reply });
  } catch (err) {
    console.error('[assistant] request failed:', err.message);
    res.status(502).json({ error: 'Could not reach the AI service. Please check the server internet connection.' });
  }
});

/* ---------- API: health check ---------- */
app.get('/api/health', function (req, res) {
  res.json({
    ok: true,
    aiConfigured: Boolean(GEMINI_API_KEY),
    model: GEMINI_MODEL
  });
});

/* ---------- 404 fallback ---------- */
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, function () {
  console.log('Jamia Usmania Sabera Mission server running at http://localhost:' + PORT);
  console.log('AI assistant: ' + (GEMINI_API_KEY ? 'CONFIGURED (model ' + GEMINI_MODEL + ')' : 'NOT configured — add GEMINI_API_KEY to server/.env'));
});
