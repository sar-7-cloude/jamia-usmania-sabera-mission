/* ============================================================
   JAMIA USMANIA SABERA MISSION — main.js
   Shared behaviour for every page:
   mobile nav, hero slider, ticker, counters, course/event
   rendering, admission & contact forms (localStorage),
   gallery lightbox, and the AI assistant chat widget.
   ============================================================ */

(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- tiny localStorage helper ---------- */
  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage full/blocked */ }
    }
  };
  window.JUSMStore = store; // used by admin.js

  /* ---------- mobile navigation ---------- */
  var navToggle = $('#navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('#nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- hero image slider (auto, dots, arrows, swipe) ---------- */
  (function initSlider() {
    var slider = $('#heroSlider');
    if (!slider) return;

    var slides = $$('.slide', slider);
    if (!slides.length) return;
    var dotsWrap = $('#sliderDots');
    var dots = [];

    slides.forEach(function (_, idx) {
      var b = document.createElement('button');
      b.className = 'dot';
      b.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
      b.addEventListener('click', function () { go(idx); restart(); });
      dotsWrap.appendChild(b);
      dots.push(b);
    });

    var current = 0, timer = null;

    function go(n) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(current + 1); }, 5500);
    }

    var prev = $('#slidePrev'), next = $('#slideNext');
    if (prev) prev.addEventListener('click', function () { go(current - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(current + 1); restart(); });

    /* touch swipe for low-end phones */
    var x0 = null;
    slider.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); restart(); }
      x0 = null;
    }, { passive: true });

    go(0);
    restart();
  })();

  /* ---------- announcements ticker (seamless loop) ---------- */
  (function initTicker() {
    var track = $('#tickerTrack');
    if (!track || !window.JUSM) return;
    var items = JUSM.announcements.map(function (t) {
      return '<span class="ticker-item">' + escapeHTML(t) + '</span>';
    }).join('');
    track.innerHTML = items + items; /* duplicate for a seamless loop */
  })();

  /* ---------- animated counters ---------- */
  (function initCounters() {
    var counters = $$('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1300, 1);
          el.textContent = Math.round(target * (p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  })();

  /* ---------- render course cards ---------- */
  (function renderCourses() {
    var wrap = $('[data-courses]');
    if (!wrap || !window.JUSM) return;
    var limit = parseInt(wrap.getAttribute('data-limit'), 10) || 0;
    var list = limit ? JUSM.courses.slice(0, limit) : JUSM.courses;

    wrap.innerHTML = list.map(function (c) {
      return (
        '<article class="course-card">' +
          '<div class="course-top"><div><h3>' + escapeHTML(c.name) + '</h3>' +
          (c.urdu ? '<span class="urdu" dir="rtl">' + escapeHTML(c.urdu) + '</span>' : '') +
          '</div><span class="badge">' + escapeHTML(c.tag) + '</span></div>' +
          '<p class="course-desc">' + escapeHTML(c.desc) + '</p>' +
          '<ul class="course-meta">' +
            '<li>Duration<strong>' + escapeHTML(c.duration) + '</strong></li>' +
            '<li>Seats<strong>' + c.seats + '</strong></li>' +
            '<li>Monthly fee<strong>' + escapeHTML(c.fee) + '</strong></li>' +
            '<li>Adm. fee<strong>' + escapeHTML(c.admissionFee) + '</strong></li>' +
            '<li class="full">Eligibility<strong>' + escapeHTML(c.eligibility) + '</strong></li>' +
          '</ul>' +
          '<a class="btn btn-outline btn-sm" href="admission.html?course=' + encodeURIComponent(c.id) + '">Apply for this course</a>' +
        '</article>'
      );
    }).join('');
  })();

  /* ---------- course filter (courses page) ---------- */
  (function initFilter() {
    var bar = $('#courseFilter');
    if (!bar) return;
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-tag]');
      if (!btn) return;
      $$('#courseFilter button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var tag = btn.getAttribute('data-tag');
      $$('[data-courses] .course-card').forEach(function (card) {
        var match = tag === 'All' || card.textContent.indexOf(tag) !== -1;
        card.style.display = match ? '' : 'none';
      });
    });
  })();

  /* ---------- render upcoming events ---------- */
  (function renderEvents() {
    var wrap = $('[data-events]');
    if (!wrap || !window.JUSM) return;
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var today = new Date().toISOString().slice(0, 10);
    wrap.innerHTML = JUSM.events
      .filter(function (ev) { return ev.date >= today; })
      .slice(0, parseInt(wrap.getAttribute('data-limit'), 10) || 10)
      .map(function (ev) {
        var d = new Date(ev.date + 'T00:00:00');
        if (isNaN(d)) return '';
        return (
          '<article class="event">' +
            '<div class="event-date"><b>' + d.getDate() + '</b><span>' + months[d.getMonth()] + ' ' + d.getFullYear() + '</span></div>' +
            '<div class="event-body"><h3>' + escapeHTML(ev.title) + '</h3><p>' + escapeHTML(ev.desc) + '</p></div>' +
          '</article>'
        );
      }).join('') || '<p class="muted">No upcoming events announced yet.</p>';
  })();

  /* ---------- gallery + lightbox ---------- */
  (function initGallery() {
    var wrap = $('#galleryGrid');
    if (wrap && window.JUSM) {
      wrap.innerHTML = JUSM.gallery.map(function (g, i) {
        return (
          '<figure class="g-item" data-index="' + i + '">' +
            '<img src="images/' + g.file + '" alt="' + escapeHTML(g.caption) + '" loading="lazy">' +
            '<figcaption>' + escapeHTML(g.caption) + '</figcaption>' +
          '</figure>'
        );
      }).join('');
    }

    var lb = $('#lightbox');
    if (!lb) return;
    var lbImg = $('#lbImg'), lbCap = $('#lbCap'), idx = 0;

    function show(i) {
      idx = (i + JUSM.gallery.length) % JUSM.gallery.length;
      lbImg.src = 'images/' + JUSM.gallery[idx].file;
      lbCap.textContent = JUSM.gallery[idx].caption;
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function hide() {
      lb.hidden = true;
      document.body.style.overflow = '';
    }
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.g-item');
      if (item) { show(parseInt(item.getAttribute('data-index'), 10)); return; }
      if (e.target.closest('#lbClose') || e.target === lb) hide();
      var prev = e.target.closest('#lbPrev'); if (prev) { show(idx - 1); return; }
      var next = e.target.closest('#lbNext'); if (next) { show(idx + 1); return; }
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();

  /* ---------- generic form validation ---------- */
  function validateField(field) {
    var input = field.querySelector('input,select,textarea');
    if (!input) return true;
    var value = input.value.trim();
    var type = input.getAttribute('data-validate');
    var errEl = field.querySelector('.err');
    var msg = '';

    if (input.type === 'checkbox') {
      if (input.required && !input.checked) msg = 'Please tick this box to continue.';
    } else if (input.required && value === '') {
      msg = 'This field is required.';
    } else if (value !== '') {
      if (type === 'name' && !/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF .'-]{2,39}$/.test(value)) {
        msg = 'Please enter a valid name (letters only, at least 3 characters).';
      }
      if (type === 'phone') {
        var digits = value.replace(/[\s\-()+]/g, '').replace(/^91(?=\d{10}$)/, '');
        if (!/^[6-9]\d{9}$/.test(digits)) msg = 'Enter a valid 10-digit Indian mobile number.';
      }
      if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        msg = 'Enter a valid email address.';
      }
      if (type === 'dob') {
        var d = new Date(value);
        var now = new Date();
        if (isNaN(d) || d > now) msg = 'Enter a valid date of birth.';
        else if (now.getFullYear() - d.getFullYear() > 25) msg = 'Age above 25 \u2014 please contact the office directly.';
      }
    }

    if (errEl) { errEl.textContent = msg; errEl.classList.toggle('show', !!msg); }
    input.classList.toggle('invalid', !!msg);
    return !msg;
  }

  function initForm(formSel, storageKey, buildRecord, onDone) {
    var form = $(formSel);
    if (!form) return;
    $$('.field', form).forEach(function (field) {
      var input = field.querySelector('input,select,textarea');
      if (input) {
        input.addEventListener('blur', function () { validateField(field); });
        input.addEventListener('input', function () {
          if (input.classList.contains('invalid')) validateField(field);
        });
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('.field', form).forEach(function (field) {
        if (!validateField(field)) ok = false;
      });
      if (!ok) {
        var firstBad = $('.invalid', form);
        if (firstBad) firstBad.focus();
        return;
      }
      var list = store.get(storageKey, []);
      var record = buildRecord(form);
      record.id = 'JUSM-' + Date.now().toString(36).toUpperCase();
      record.createdAt = new Date().toISOString();
      record.status = 'new';
      list.unshift(record);
      store.set(storageKey, list);
      form.reset();
      if (onDone) onDone(record);
    });
  }

  /* ---------- admission form ---------- */
  initForm('#admissionForm', 'jusm_enquiries', function (form) {
    return {
      name: form.admName.value.trim(),
      father: form.admFather.value.trim(),
      dob: form.admDob.value,
      gender: (form.querySelector('input[name=gender]:checked') || {}).value || '',
      course: form.admCourse.options[form.admCourse.selectedIndex].text,
      courseId: form.admCourse.value,
      phone: form.admPhone.value.trim(),
      email: form.admEmail.value.trim(),
      address: form.admAddress.value.trim(),
      previous: form.admPrevious.value.trim(),
      message: form.admMessage.value.trim()
    };
  }, function (record) {
    var formWrap = $('#admissionFormWrap');
    var success = $('#admissionSuccess');
    $('#enqId').textContent = record.id;
    if (formWrap) formWrap.hidden = true;
    if (success) { success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });

  /* pre-select course from ?course= param */
  (function preselectCourse() {
    var select = $('#admCourse');
    if (!select || !window.JUSM) return;
    JUSM.courses.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id; opt.textContent = c.name + ' \u2014 ' + c.duration;
      select.appendChild(opt);
    });
    var want = new URLSearchParams(location.search).get('course');
    if (want && select.querySelector('option[value="' + want + '"]')) select.value = want;
  })();

  /* submit another enquiry button */
  var againBtn = $('#newEnquiry');
  if (againBtn) {
    againBtn.addEventListener('click', function () {
      $('#admissionSuccess').hidden = true;
      var w = $('#admissionFormWrap');
      w.hidden = false;
      w.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- contact form ---------- */
  initForm('#contactForm', 'jusm_messages', function (form) {
    return {
      name: form.ctName.value.trim(),
      phone: form.ctPhone.value.trim(),
      email: form.ctEmail.value.trim(),
      subject: form.ctSubject.value.trim(),
      message: form.ctMessage.value.trim()
    };
  }, function () {
    var ok = $('#contactDone');
    if (ok) { ok.hidden = false; ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });

  /* ---------- AI assistant chat widget ---------- */
  (function initChat() {
    var fab = $('#chatFab'), panel = $('#chatPanel');
    if (!fab || !panel) return;

    var body = $('#chatBody'), form = $('#chatForm'), input = $('#chatInput');
    var history = []; // [{role:'user'|'model', content:'...'}]

    function addMsg(text, cls) {
      var div = document.createElement('div');
      div.className = 'msg ' + cls;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      return div;
    }

    function greeting() {
      addMsg('Assalamu alaikum! I am the Jamia Usmania Sabera Mission assistant. Ask me about courses, fees, hostel, or the admission process.', 'bot');
    }

    fab.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      if (!panel.hidden && !body.children.length) greeting();
      if (!panel.hidden) input.focus();
    });
    var closeBtn = $('#chatClose');
    if (closeBtn) closeBtn.addEventListener('click', function () { panel.hidden = true; });

    $$('.chat-suggest button').forEach(function (b) {
      b.addEventListener('click', function () {
        input.value = b.textContent.trim();
        form.dispatchEvent(new Event('submit'));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      addMsg(text, 'user');
      input.value = '';
      send(text);
    });

    function send(text) {
      var typing = document.createElement('div');
      typing.className = 'typing';
      typing.textContent = 'Assistant is typing\u2026';
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      var done = function (reply) {
        typing.remove();
        addMsg(reply, 'bot');
      };

      fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-6) })
      })
        .then(function (res) {
          if (!res.ok) {
            return res.json().catch(function () { return {}; }).then(function (data) {
              throw new Error(data.error || 'Server error ' + res.status);
            });
          }
          return res.json();
        })
        .then(function (data) {
          history.push({ role: 'user', content: text });
          if (data.reply) history.push({ role: 'model', content: data.reply });
          done(data.reply || 'Sorry, I could not get a reply. Please try again.');
        })
        .catch(function (err) {
          typing.remove();
          var offline = (err instanceof TypeError);
          addMsg(
            offline
              ? 'The AI assistant needs the Node.js server to be running (see README.md \u2014 "npm start" inside the server folder). Without the server, the Gemini API key would have to be exposed in the frontend, which is not safe.'
              : (err.message || 'Something went wrong. Please try again.'),
            'error'
          );
        });
    }
  })();

  /* ---------- footer year ---------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- helpers ---------- */
  /* entity strings are concatenated so no literal entity sequence appears in source */
  var ENT = { amp: 'amp;', lt: 'lt;', gt: 'gt;', quot: 'quot;', sq: '#39;' };
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      var e = '&' + (ch === '&' ? ENT.amp : ch === '<' ? ENT.lt : ch === '>' ? ENT.gt : ch === '"' ? ENT.quot : ENT.sq);
      return e;
    });
  }
})();
