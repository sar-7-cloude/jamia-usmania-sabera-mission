/* ============================================================
   JAMIA USMANIA SABERA MISSION â€” admin.js
   Demo admin panel: login + enquiries/messages dashboard.
   Data is read from localStorage (filled by admission.html
   and contact.html). For a real multi-user system, move this
   to a backend with proper authentication (see README.md).
   ============================================================ */

(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var store = window.JUSMStore;

  var CREDS_KEY = 'jusm_admin_creds';
  var SESSION_KEY = 'jusm_admin_session';
  var SESSION_MS = 8 * 60 * 60 * 1000; /* 8 hours */

  function getCreds() {
    return store.get(CREDS_KEY, { user: 'admin', pass: 'admin123' });
  }

  function isLoggedIn() {
    var s = store.get(SESSION_KEY, null);
    return !!(s && s.until > Date.now());
  }

  /* ---------- login / logout --------- */
  var loginForm = $('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var errEl = $('#loginErr');
      var creds = getCreds();
      var user = loginForm.admUser.value.trim();
      var pass = loginForm.admPass.value;
      if (user === creds.user && pass === creds.pass) {
        store.set(SESSION_KEY, { until: Date.now() + SESSION_MS });
        showDashboard();
      } else {
        errEl.textContent = 'Invalid username or password.';
        errEl.classList.add('show');
      }
    });
  }

  var logoutBtn = $('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem(SESSION_KEY);
      location.reload();
    });
  }

  function showDashboard() {
    $('#loginWrap').hidden = true;
    $('#dash').classList.add('show');
    render();
  }

  /* ---------- dashboard rendering ----------- */
  var statusList = ['new', 'contacted', 'admitted', 'closed'];

  function render() {
    var enquiries = store.get('jusm_enquiries', []);
    var messages = store.get('jusm_messages', []);

    var counts = { new: 0, contacted: 0, admitted: 0, closed: 0 };
    enquiries.forEach(function (q) { if (counts[q.status] !== undefined) counts[q.status]++; });

    $('#chipTotal').textContent = enquiries.length;
    $('#chipNew').textContent = counts.new;
    $('#chipContacted').textContent = counts.contacted;
    $('#chipAdmitted').textContent = counts.admitted;

    renderTable(enquiries, messages);
  }

  function fmtDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return iso || '';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function currentTab() {
    var active = $('.tab.active');
    return active ? active.getAttribute('data-tab') : 'enquiries';
  }

  function renderTable() {
    var tab = currentTab();
    var search = ($('#searchBox') ? $('#searchBox').value : '').toLowerCase();
    var tbody = $('#tableBody');
    var rows = [];

    if (tab === 'enquiries') {
      rows = store.get('jusm_enquiries', []).filter(function (q) {
        return !search || (q.name + ' ' + q.course + ' ' + q.phone + ' ' + q.id).toLowerCase().indexOf(search) !== -1;
      });
      $('#enqCount').textContent = rows.length + ' enquir' + (rows.length === 1 ? 'y' : 'ies');
      if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty">No enquiries yet. Submit the admission form to see it here.</td></tr>';
        return;
      }
      tbody.innerHTML = rows.map(function (q, i) {
        return '<tr>' +
          '<td><strong>' + esc(q.id) + '</strong></td>' +
          '<td data-label="Date">' + fmtDate(q.createdAt) + '</td>' +
          '<td data-label="Name">' + esc(q.name) + '<br><span class="muted">s/o ' + esc(q.father || '\u2014') + '</span></td>' +
          '<td data-label="Course">' + esc(q.course) + '</td>' +
          '<td data-label="Phone">' + esc(q.phone) + '</td>' +
          '<td data-label="Status"><select class="icon-btn statusSel" data-id="' + esc(q.id) + '">' +
            statusList.map(function (s) {
              return '<option value="' + s + '"' + (q.status === s ? ' selected' : '') + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>';
            }).join('') + '</select></td>' +
          '<td><div class="row-actions">' +
            '<button class="icon-btn" data-view="' + esc(q.id) + '">View</button>' +
            '<button class="icon-btn del" data-del="' + esc(q.id) + '">Delete</button>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    } else {
      rows = store.get('jusm_messages', []).filter(function (m) {
        return !search || (m.name + ' ' + m.subject + ' ' + m.phone + ' ' + m.id).toLowerCase().indexOf(search) !== -1;
      });
      $('#enqCount').textContent = rows.length + ' message' + (rows.length === 1 ? '' : 's');
      if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty">No messages yet. Messages from the contact page appear here.</td></tr>';
        return;
      }
      tbody.innerHTML = rows.map(function (m) {
        return '<tr>' +
          '<td><strong>' + esc(m.id) + '</strong></td>' +
          '<td data-label="Date">' + fmtDate(m.createdAt) + '</td>' +
          '<td data-label="Name">' + esc(m.name) + '</td>' +
          '<td data-label="Phone">' + esc(m.phone) + (m.email ? '<br><span class="muted">' + esc(m.email) + '</span>' : '') + '</td>' +
          '<td data-label="Subject">' + esc(m.subject || '\u2014') + '</td>' +
          '<td><div class="row-actions">' +
            '<button class="icon-btn" data-viewmsg="' + esc(m.id) + '">View</button>' +
            '<button class="icon-btn del" data-delmsg="' + esc(m.id) + '">Delete</button>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    }
  }

  /* ---------- tabs / toolbar events ---------- */
  $$('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderTable();
    });
  });

  var searchBox = $('#searchBox');
  if (searchBox) searchBox.addEventListener('input', renderTable);

  var exportBtn = $('#exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      var data = store.get('jusm_enquiries', []);
      if (!data.length) { alert('No enquiries to export.'); return; }
      var head = ['Enquiry ID', 'Date', 'Name', "Father's Name", 'DOB', 'Gender', 'Course', 'Phone', 'Email', 'Address', 'Previous Education', 'Message', 'Status'];
      var lines = [head.join(',')];
      data.forEach(function (q) {
        lines.push([
          q.id, q.createdAt, q.name, q.father, q.dob, q.gender, q.course, q.phone, q.email,
          q.address, q.previous, q.message, q.status
        ].map(function (v) {
          return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
        }).join(','));
      });
      download('jamia-usmania-enquiries-' + new Date().toISOString().slice(0, 10) + '.csv', lines.join('\n'), 'text/csv');
    });
  }

  var clearBtn = $('#clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (currentTab() !== 'enquiries') {
        if (confirm('Delete ALL contact messages? This cannot be undone.')) {
          store.set('jusm_messages', []);
          render();
        }
        return;
      }
      if (confirm('Delete ALL admission enquiries? This cannot be undone.')) {
        store.set('jusm_enquiries', []);
        render();
      }
    });
  }

  /* table actions (event deletion) */
  document.addEventListener('click', function (e) {
    var view = e.target.getAttribute && e.target.getAttribute('data-view');
    var del = e.target.getAttribute && e.target.getAttribute('data-del');
    var viewMsg = e.target.getAttribute && e.target.getAttribute('data-viewmsg');
    var delMsg = e.target.getAttribute && e.target.getAttribute('data-delmsg');

    if (view) {
      var q = store.get('jusm_enquiries', []).find(function (x) { return x.id === view; });
      if (q) {
        alert(
          'Enquiry ' + q.id + '\n' +
          '------------------------------\n' +
          'Name: ' + q.name + '\n' +
          "Father's name: " + q.father + '\n' +
          'DOB: ' + q.dob + ' Gender: ' + q.gender + '\n' +
          'Course: ' + q.course + '\n' +
          'Phone: ' + q.phone + '\n' +
          'Email: ' + (q.email || '\u2014') + '\n' +
          'Address: ' + q.address + '\n' +
          'Previous education: ' + (q.previous || '\u2014') + '\n' +
          'Message: ' + (q.message || '\u2014') + '\n' +
          'Submitted: ' + fmtDate(q.createdAt) + '\n' +
          'Status: ' + q.status
        );
      }
    }
    if (del) {
      if (confirm('Delete enquiry ' + del + '?'))* {
        store.set('jusm_enquiries', store.get('jusm_enquiries', []).filter(function (x) { return x.id !== del; }));
        render();
      }
    }
    if (viewMsg) {
      var m = store.get('jusm_messages', []).find(function (x) { return x.id === viewMsg; });
      if (m) {
        alert(
          'Message ' + m.id + '\n' +
           '-----------------------------q¸œ€¬(€€€€€€€€€€€9…µ”è€œ€¬´¹¹…µ”€¬€q¸œ€¬(€€€€€€€€€€A¡½¹”è€œ€¬´¹Á¡½¹”€¬€q¸œ€¬(€€€€€€€€€€µ…¥°è€œ€¬€¡´¹•µ…¥°ñğ€qÔÈÀÄĞœ¤€¬€q¸œ€¬(€€€€€€€€€€MÕ‰©•Ğè€œ€¬€¡´¹ÍÕ‰©•Ğñğ€qÔÈÀÄĞœ¤€¬€q¸œ€¬(€€€€€€€€€€5•ÍÍ…”è€œ€¬´¹µ•ÍÍ…”€¬€q¸œ€¬(€€€€€€€€€€MÕ‰µ¥ÑÑ•è€œ€¬™µÑ…Ñ”¡´¹É•…Ñ•‘Ğ¤(€€€€€€€€¤ì(€€€€€ô(€€€ô(€€€¥˜€¡‘•±5Íœ¤ì(€€€€€¥˜€¡½¹™¥É´ •±•Ñ”µ•ÍÍ…”€œ€¬‘•±5Íœ€¬€œüœ¤¤¨ì(€€€€€€€ÍÑ½É”¹Í•Ğ ©ÕÍµ}µ•ÍÍ…•Ìœ°ÍÑ½É”¹•Ğ ©ÕÍµ}µ•ÍÍ…•Ìœ°mt¤¹™¥±Ñ•È¡™Õ¹Ñ¥½¸€¡à¤ìÉ•ÑÕÉ¸à¹¥€„ôô‘•±5Íœìô¤¤ì(€€€€€€€É•¹‘•È ¤ì(€€€ô(€€€ô(€ô¤ì((€‘½Õµ•¹Ğ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ¡…¹”œ°™Õ¹Ñ¥½¸€¡”¤ì(€€€¥˜€¡”¹Ñ…É•Ğ¹±…ÍÍ1¥ÍĞ€˜˜”¹Ñ…É•Ğ¹±…ÍÍ1¥ÍĞ¹½¹Ñ…¥¹Ì ÍÑ…ÑÕÍM•°œ¤¤ì(€€€€€Ù…È¥€ô”¹Ñ…É•Ğ¹•ÑÑÑÉ¥‰ÕÑ” ‘…Ñ„µ¥œ¤ì(€€€€€Ù…È±¥ÍĞ€ôÍÑ½É”¹•Ğ ©ÕÍµ}•¹ÅÕ¥É¥•Ìœ°mt¤ì(€€€€€Ù…È¥Ñ•´€ô±¥ÍĞ¹™¥¹¡™Õ¹Ñ¥½¸€¡à¤ìÉ•ÑÕÉ¸à¹¥€ôôô¥ìô¤ì(€€€€€¥˜€¡¥Ñ•´¤ì(€€€€€€€¥Ñ•´¹ÍÑ…ÑÕÌ€ô”¹Ñ…É•Ğ¹Ù…±Õ”ì(€€€€€€€ÍÑ½É”¹Í•Ğ ©ÕÍµ}•¹ÅÕ¥É¥•Ìœ°±¥ÍĞ¤ì(€€€€€€€É•¹‘•È ¤ì(€€€€€ô(€€€ô(€ô¤ì((€€¼¨€´´´´´´´´´´´¡…¹”Á…ÍÍİ½É€´´´´´´´´´´€¨¼(€Ù…ÈÁİ½É´€ô€ œÁİ½É´œ¤ì(€¥˜€¡Áİ½É´¤ì(€€€Áİ½É´¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ÍÕ‰µ¥Ğœ°™Õ¹Ñ¥½¸€¡”¤ì(€€€€€”¹ÁÉ•Ù•¹Ñ•™…Õ±Ğ ¤ì(€€€€€Ù…È•ÉÉ°€ô€ œÁİÉÈœ¤ì(€€€€€Ù…ÈÉ•‘Ì€ô•ÑÉ•‘Ì ¤ì(€€€€€Ù…È½±‘AÜ€ôÁİ½É´¹Áİ=±¹Ù…±Õ”ì(€€€€€Ù…È¹•İAÜ€ôÁİ½É´¹Áİ9•Ü¹Ù…±Õ”ì(€€€€€Ù…È½¹™AÜ€ôÁİ½É´¹Áİ½¹˜¹Ù…±Õ”ì(€€€€€¥˜€¡½±‘AÜ€„ôôÉ•‘Ì¹Á…ÍÌ¤ì(€€€€€€€•ÉÉ°¹Ñ•áÑ½¹Ñ•¹Ğ€ô€ÕÉÉ•¹ĞÁ…ÍÍİ½É¥Ì¥¹½ÉÉ•Ğ¸œì(€€€€€€€•ÉÉ°¹±…ÍÍ1¥ÍĞ¹…‘ Í¡½Üœ¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€€€¥˜€¡¹•İAÜ¹±•¹Ñ €ğ€Ø¤ì(€€€€€€€•ÉÉ°¹Ñ•áÑ½¹Ñ•¹Ğ€ô€9•ÜÁ…ÍÍİ½ÉµÕÍĞ‰”…Ğ±•…ÍĞ€Ø¡…É…Ñ•ÉÌ¸œì(€€€€€€€•ÉÉ°¹±…ÍÍ1¥ÍĞ¹…‘ Í¡½Üœ¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€€€¥˜€¡¹•İAÜ€„ôô½¹™AÜ¤ì(€€€€€€€•ÉÉ°¹Ñ•áÑ½¹Ñ•¹Ğ€ô€9•ÜÁ…ÍÍİ½É‘Ì‘¼¹½Ğµ…Ñ ¸œì(€€€€€€€•ÉÉ°¹±…ÍÍ1¥ÍĞ¹…‘ Í¡½Üœ¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô(€€€€€ÍÑ½É”¹Í•Ğ¡IM}-d°ìÕÍ•ÈèÉ•‘Ì¹ÕÍ•È°Á…ÍÌè¹•İAÜô¤ì(€€€€€Áİ½É´¹É•Í•Ğ ¤ì(€€€€€•ÉÉ°¹±…ÍÍ1¥ÍĞ¹É•µ½Ù” Í¡½Üœ¤ì(€€€€€…±•ÉĞ A…ÍÍİ½É¡…¹•ÍÕ•ÍÍ™Õ±±ä¸œ¤ì(€€€ô¤ì(€ô((€€¼¨€´´´´´´´´´´´½¹Ñ•¹Ğ•‘¥Ñ½È€¡…¹¹½Õ¹•µ•¹ÑÌ€¼•Ù•¹ÑÌ€¼½ÕÉÍ•Ì¤€´´´´´´´´´´´´€¨¼(€Ù…È=YII%}-d€ô€©ÕÍµ}½¹Ñ•¹Ñ}½Ù•ÉÉ¥‘•Ìœì((€™Õ¹Ñ¥½¸ÕÉÉ•¹Ñ…Ñ„ ¤ì(€€€Ù…È¼€ôÍÑ½É”¹•Ğ¡=YII%}-d°¹Õ±°¤ñğíôì(€€€Ù…È€ôİ¥¹‘½Ü¹)UM4ñğíôì(€€€É•ÑÕÉ¸ì(€€€€€…¹¹½Õ¹•µ•¹ÑÌè¼¹…¹¹½Õ¹•µ•¹ÑÌñğ¹…¹¹½Õ¹•µ•¹ÑÌñğmt°(€€€€€•Ù•¹ÑÌè¼¹•Ù•¹ÑÌñğ¹•Ù•¹ÑÌñğmt°(€€€€€½ÕÉÍ•Ìè¼¹½ÕÉÍ•Ìñğ¹½ÕÉÍ•Ìñğmt(€€€ôì(€ô((€İ¥¹‘½Ü¹±½…‘½¹Ñ•¹Ñ‘¥Ñ½È€ô™Õ¹Ñ¥½¸€ ¤ì(€€€Ù…È€ôÕÉÉ•¹Ñ…Ñ„ ¤ì(€€€€ œÑ¹¹½Õ¹•µ•¹ÑÌœ¤¹Ù…±Õ”€ô¹…¹¹½Õ¹•µ•¹ÑÌ¹©½¥¸ q¸œ¤ì(€€€€ œÑÙ•¹ÑÌœ¤¹Ù…±Õ”€ô¹•Ù•¹ÑÌ¹µ…À¡™Õ¹Ñ¥½¸€¡”¤ì(€€€€€É•ÑÕÉ¸”¹‘…Ñ”€¬€œğ€œ€¬”¹Ñ¥Ñ±”€¬€œğ€œ€¬”¹‘•ÍŒì(€€€ô¤¹©½¥¸ q¸œ¤ì(€€€€ œÑ½ÕÉÍ•Ìœ¤¹Ù…±Õ”€ô¹½ÕÉÍ•Ì¹µ…À¡™Õ¹Ñ¥½¸€¡Œ¤ì(€€€€€É•ÑÕÉ¸mŒ¹¥°Œ¹¹…µ”°Œ¹‘ÕÉ…Ñ¥½¸°Œ¹Í•…ÑÌ°Œ¹™•”°Œ¹…‘µ¥ÍÍ¥½¹•”°Œ¹•±¥¥‰¥±¥Ñä°Œ¹‘•ÍŒ°Œ¹Ñ…œñğ€œœ°Œ¹ÕÉ‘Ôñğ€œt¹©½¥¸ œğ€œ¤ì(€€€ô¤¹©½¥¸ q¸œ¤ì(€ôì((€Ù…È½¹Ñ•¹ÑM…Ù”€ô€ œ½¹Ñ•¹ÑM…Ù”œ¤ì(€¥˜€¡½¹Ñ•¹ÑM…Ù”¤ì(€€€½¹Ñ•¹ÑM…Ù”¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°™Õ¹Ñ¥½¸€ ¤ì(€€€€€Ù…ÈµÍœ€ô€ œ½¹Ñ•¹Ñ5Íœœ¤ì(€€€€€™Õ¹Ñ¥½¸Í¡½Ü¡Ñ•áĞ°½½¤ì(€€€€€€€µÍœ¹¡¥‘‘•¸€ô™…±Í”ì(€€€€€€€µÍœ¹Ñ•áÑ½¹Ñ•¹Ğ€ôÑ•áĞì(€€€€€€€µÍœ¹ÍÑå±”¹‰½É‘•É1•™Ñ½±½È€ô½½€ü€œŒÁÙˆÑ˜œ€è€œŒÀÌäÉˆœì(€€€€€€€µÍœ¹ÍÑå±”¹‰…­É½Õ¹€ô½½€ü€œ”İ˜É•Œœ€è€œ™‘••„œì(€€€€€ô(€€€€€™Õ¹Ñ¥½¸±¥¹•Ì¡¥¤ì(€€€€€€€É•ÑÕÉ¸€¡¥¤¹Ù…±Õ”¹ÍÁ±¥Ğ q¸œ¤¹µ…À¡™Õ¹Ñ¥½¸€¡Ì¤ìÉ•ÑÕÉ¸Ì¹ÑÉ¥´ ¤ìô¤¹™¥±Ñ•È¡™Õ¹Ñ¥½¸€¡Ì¤ìÉ•ÑÕÉ¸Ì€„ôô€œœìô¤ì(€€€€€ô((€€€€€€¼¨…¹¹½Õ¹•µ•¹ÑÌ€¨¼(€€€€€Ù…È…¹¹½Õ¹•µ•¹ÑÌ€ô±¥¹•Ì œÑ¹¹½Õ¹•µ•¹ÑÌœ¤ì(€€€€€¥˜€ ……¹¹½Õ¹•µ•¹ÑÌ¹±•¹Ñ ¤ì(€€€€€€€Í¡½Ü ¹¹½Õ¹•µ•¹ÑÌ…¹¹½Ğ‰”•µÁÑä¸‘…Ğ±•…ÍĞ½¹”±¥¹”°½ÈÕÍ”€‰I•Í•ĞÑ¼•™…Õ±ÑÌˆ¸œ°™…±Í”¤ì(€€€€€€€É•ÑÕÉ¸ì(€€€€€ô((€€€€€€¼¨•Ù•¹ÑÌè‘…Ñ”ğÑ¥Ñ±”ğ‘•ÍŒ€¨¼(€€€€€Ù…È•Ù•¹ÑÌ€ômtì(€€€€€Ù…È‰…‘Ù•¹Ğ€ô€œœì(€€€€€±¥¹•Ì œÑÙ•¹ÑÌœ¤¹™½É… ¡™Õ¹Ñ¥½¸€¡±¥¹”¤ì(€€€€€€€Ù…ÈÀ€ô±¥¹”¹ÍÁ±¥Ğ ğœ¤¹µ…À¡™Õ¹Ñ¥½¸€¡Ì¤ìÉ•ÑÕÉ¸Ì¹ÑÉ¥´ ¤ìô¤ì(€€€€€€€¥˜€¡À¹±•¹Ñ €ğ€Ìñğ€„½yq‘ìÑôµq‘ìÉôµq‘ìÉô¼¹Ñ•ÍĞ¡ÁlÁt¤¤ì‰…‘Ù•¹Ğ€ô±¥¹”ìÉ•ÑÕÉ¸ìô(€€€€€€€•Ù•¹ÑÌ¹ÁÕÍ ¡ì‘…Ñ”èÁlÁt°Ñ¥Ñ±”èÁlÅt°‘•ÍŒèÀ¹Í±¥” È¤¹©½¥¸ œğ€œ¤ô¤ì(€€€€€ô¤ì(€€€€€¥˜€¡‰…‘Ù•¹Ğ¤ì(€€€€€€€Í¡½Ü Q¡¥Ì•Ù•¹Ğ±¥¹”¥Ì¹½ĞÙ…±¥è€ˆœ€¬‰…‘Ù•¹Ğ€¬€œˆ¸UÍ”eeedµ54µğQ¥Ñ±”ğ•ÍÉ¥ÁÑ¥½¸œ°™…±Í”¤ì(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€ô((€€€€€€¼¨½ÕÉÍ•Ìè¥ğ¹…µ”ğ‘ÕÉ…Ñ¥½¸ğÍ•…ÑÌğ™•”ğ…‘´™•”ğ•±¥¥‰¥±¥Ñäğ‘•ÍŒğÑ…œğÕÉ‘Ô€¨¼(€€€€€Ù…È½ÕÉÍ•Ì€ômtì(€€€€€Ù…È‰…‘½ÕÉÍ”€ô€œœì(€€€€€±¥¹•Ì œÑ½ÕÉÍ•Ìœ¤¹™½É… ¡™Õ¹Ñ¥½¸€¡±¥¹”¤ì(€€€€€€€Ù…ÈÀ€ô±¥¹”¹ÍÁ±¥Ğ ğœ¤¹µ…À¡™Õ¹Ñ¥½¸€¡Ì¤ìÉ•ÑÕÉ¸Ì¹ÑÉ¥´ ¤ìô¤ì(€€€€€€€¥˜€¡À¹±•¹Ñ €ğ€àñğ€…ÁlÁtñğ€…ÁlÅt¤ì‰…‘½ÕÉÍ”€ô±¥¹”ìÉ•ÑÕÉ¸ìô(€€€€€€€½ÕÉÍ•Ì¹ÁÕÍ ¡ì(€€€€€€€€€¥èÁlÁt°¹…µ”èÁlÅt°‘ÕÉ…Ñ¥½¸èÁlÉt°(€€€€€€€€€Í•…ÑÌèÁ…ÉÍ•%¹Ğ¡ÁlÍt°€ÄÀ¤ñğ€À°™•”èÁlÑt°…‘µ¥ÍÍ¥½¹•”èÁlÕt°(€€€€€€€€€•±¥¥‰¥±¥ÑäèÁlÙt°‘•ÍŒèÁlİt°Ñ…œèÁlátñğ€½ÕÉÍ”œ°ÕÉ‘ÔèÁlåtñğ€œœ(€€€€€€€ô¤ì(€€€€€ô¤ì(€€€€€¥˜€¡‰…‘½ÕÉÍ”¤ì(€€€€€€€€€Í¡½İUQ¡¥Ì½ÕÉÍ”±¥¹”¹••‘Ì…Ğ±•…ÍĞÑ¡”™¥ÉÍĞ€à™¥•±‘Ìè€ˆœ€¬‰…‘½ÕÉÍ”€¬€œˆ¸œ°™…±Í”¤ì(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€ô((€€€€€ÍÑ½É”¹Í•Ğ¡=YII%}-d°ì…¹¹½Õ¹•µ•¹ÑÌè…¹¹½Õ¹•µ•¹ÑÌ°•Ù•¹ÑÌè•Ù•¹ÑÌ°½ÕÉÍ•Ìè½ÕÉÍ•Ìô¤ì(€€€€€€€Í¡½Ü M…Ù•„I•™É•Í …¹äÁ…”½˜Ñ¡”Í¥Ñ”Ñ¼Í•”å½ÕÈ•‘¥ÑÌ€¡Ñ¡•ä…ÁÁ±ä¥¸Ñ¡¥Ì‰É½İÍ•È¤¸œ°ÑÉÕ”¤ì(€€€ô¤ì(€ô((€Ù…È½¹Ñ•¹ÑI•Í•Ğ€ô€ œ½¹Ñ•¹ÑI•Í•Ğœ¤ì(€¥˜€¡½¹Ñ•¹ÑI•Í•Ğ¤ì(€€€½¹Ñ•¹ÑI•Í•Ğ¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ±¥¬œ°™Õ¹Ñ¥½¸€ ¤ì(€€€€€¥˜€ …½¹™¥É´ I•µ½Ù”10½¹Ñ•¹Ğ•‘¥ÑÌ…¹É•ÍÑ½É”Ñ¡”‘•™…Õ±Ğ½¹Ñ•¹Ğüœ¤¤É•ÑÕÉ¸ì(€€€€€±½…±MÑ½É…”¹É•µ½Ù•%Ñ•´¡=YII%}-d¤ì(€€€€€İ¥¹‘½Ü¹±½…‘½¹Ñ•¹Ñ‘¥Ñ½È ¤ì(€€€€€Ù…ÈµÍœ€ô€ œ½¹Ñ•¹Ñ5Íœœ¤ì(€€€€€¥˜€¡µÍœ¤ì(€€€€€€€€€µÍœ¹¡¥‘‘•¸€ô™…±Í”ì(€€€€€€€€€µÍœ¹Ñ•áÑ½¹Ñ•¹Ğ€ô€•™…Õ±ÑÌÉ•ÍÑ½É•¸I•™É•Í Ñ¡”Í¥Ñ”Á…•ÌÑ¼Í•”Ñ¡•´¸œì(€€€€€€€€€µÍœ¹ÍÑå±”¹‰½É‘•É1•™Ñ½±½È€ô€œŒÁÙˆÑ˜œì(€€€€€€€€€€€µÍœ¹ÍÑå±”¹‰…­É½Õ¹€ô€œ”İ˜É•Œœì(€€€€€€€ô(€€€€€ô¤ì(€ô((€€¼¨€´´´´´´´´´´‰½½Ğ€´´´´´´´´´´€¨¼(€¥˜€¡¥Í1½•‘%¸ ¤¤Í¡½İ…Í¡‰½…É ¤ì(€•±Í”€ œ±½¥¹]É…Àœ¤¹¡¥‘‘•¸€ô™…±Í”ì((€€¼¨€´´´´´´´´´´¡•±Á•ÉÌ€´´´´´´´´´´€¨¼(€Ù…È9P€ôì…µÀè€…µÀìœ°±Ğè€±Ğìœ°Ğè€Ğìœ°ÅÕ½Ğè€ÅÕ½Ğìœ°ÍÄè€œŒÌäìœôì(€™Õ¹Ñ¥½¸•ÍŒ¡ÍÑÈ¤ì(€€€É•ÑÕÉ¸MÑÉ¥¹œ¡ÍÑÈ€ôô¹Õ±°€ü€œœ€èÍÑÈ¤¹É•Á±…” ½l˜ğøˆt½œ°™Õ¹Ñ¥½¸€¡ ¤ì(€€€€€É•ÑÕÉ¸€œ˜œ€¬€¡ €ôôô€œ˜œ€ü9P¹…µÀ€è €ôôô€œğœ€ü9P¹±Ğ€è €ôôô€œøœ€ü9P¹Ğ€è €ôôô€œˆœ€ü9P¹ÅÕ½Ğ€è9P¹ÍÄ¤ì(€€€ô¤ì(€ô(€™Õ¹Ñ¥½¸‘½İ¹±½…¡™¥±•¹…µ”°Ñ•áĞ°µ¥µ”¤ì(€€€Ù…È‰±½ˆ€ô¹•Ü	±½ˆ¡lqÕœ€¬Ñ•áÑt°ìÑåÁ”è€¡µ¥µ”ñğ€Ñ•áĞ½Á±…¥¸œ¤€¬€œí¡…ÉÍ•ĞõÕÑ˜´àœô¤ì(€€€Ù…ÈÕÉ°€ôUI0¹É•…Ñ•=‰©•ÑUI0¡‰±½ˆ¤ì(€€€Ù…È„€ô‘½Õµ•¹Ğ¹É•…Ñ•±•µ•¹Ğ „œ¤ì(€€€„¹¡É•˜€ôÕÉ°ì„¹‘½İ¹±½…€ô™¥±•¹…µ”ì(€€€‘½Õµ•¹Ğ¹‰½‘ä¹…ÁÁ•¹‘¡¥±¡„¤ì(€€€„¹±¥¬ ¤ì(€€€„¹É•µ½Ù” ¤ì(€€€Í•ÑQ¥µ•½ÕĞ¡™Õ¹Ñ¥½¸€ ¤ìUI0¹É•Ù½­•=‰©•ÑUI0¡ÕÉ°¤ìô°€ÄÀÀÀ¤ì(€ô)ô¤ ¤ì(