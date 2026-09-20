/* ============================================================
   JAMIA USMANIA SABERA MISSION — admin.js
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

  /* ---------- login / logout ---------- */
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

  /* ---------- dashboard rendering ---------- */
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

  /* table actions (event delegation) */
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
          '-----------------------------\n' +
          'Name: ' + q.name + '\n' +
          "Father's name: " + q.father + '\n' +
          'DOB: ' + q.dob + '  Gender: ' + q.gender + '\n' +
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
      if (confirm('Delete enquiry ' + del + '?')) {
        store.set('jusm_enquiries', store.get('jusm_enquiries', []).filter(function (x) { return x.id !== del; }));
        render();
      }
    }
    if (viewMsg) {
      var m = store.get('jusm_messages', []).find(function (x) { return x.id === viewMsg; });
      if (m) {
        alert(
          'Message ' + m.id + '\n' +
          '-----------------------------\n' +
          'Name: ' + m.name + '\n' +
          'Phone: ' + m.phone + '\n' +
          'Email: ' + (m.email || '\u2014') + '\n' +
          'Subject: ' + (m.subject || '\u2014') + '\n' +
          'Message: ' + m.message + '\n' +
          'Submitted: ' + fmtDate(m.createdAt)
        );
      }
    }
    if (delMsg) {
      if (confirm('Delete message ' + delMsg + '?')) {
        store.set('jusm_messages', store.get('jusm_messages', []).filter(function (x) { return x.id !== delMsg; }));
        render();
      }
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.classList && e.target.classList.contains('statusSel')) {
      var id = e.target.getAttribute('data-id');
      var list = store.get('jusm_enquiries', []);
      var item = list.find(function (x) { return x.id === id; });
      if (item) {
        item.status = e.target.value;
        store.set('jusm_enquiries', list);
        render();
      }
    }
  });

  /* ---------- change password ---------- */
  var pwForm = $('#pwForm');
  if (pwForm) {
    pwForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var errEl = $('#pwErr');
      var creds = getCreds();
      var oldPw = pwForm.pwOld.value;
      var newPw = pwForm.pwNew.value;
      var confPw = pwForm.pwConf.value;
      if (oldPw !== creds.pass) {
        errEl.textContent = 'Current password is incorrect.';
        errEl.classList.add('show');
        return;
      }
      if (newPw.length < 6) {
        errEl.textContent = 'New password must be at least 6 characters.';
        errEl.classList.add('show');
        return;
      }
      if (newPw !== confPw) {
        errEl.textContent = 'New passwords do not match.';
        errEl.classList.add('show');
        return;
      }
      store.set(CREDS_KEY, { user: creds.user, pass: newPw });
      pwForm.reset();
      errEl.classList.remove('show');
      alert('Password changed successfully.');
    });
  }

  /* ---------- boot ---------- */
  if (isLoggedIn()) showDashboard();
  else $('#loginWrap').hidden = false;

  /* ---------- helpers ---------- */
  var ENT = { amp: 'amp;', lt: 'lt;', gt: 'gt;', quot: 'quot;', sq: '#39;' };
  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (ch) {
      return '&' + (ch === '&' ? ENT.amp : ch === '<' ? ENT.lt : ch === '>' ? ENT.gt : ch === '"' ? ENT.quot : ENT.sq);
    });
  }
  function download(filename, text, mime) {
    var blob = new Blob(['\uFEFF' + text], { type: (mime || 'text/plain') + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
})();
