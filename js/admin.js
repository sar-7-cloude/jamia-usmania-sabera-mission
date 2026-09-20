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
  var $$ = function (sel, ctx) { rdurn Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
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
    $  ‘ÆÆöv–åw&r’æ†–FFVâÒG'VS°¢B‚r6F6‚r’æ6Æ74Æ—7BæFB‚w6†÷rr“°¢&VæFW"‚“°¢Ð ¢ò¢ÒÒÒÒÒÒÒÒÒÒF6†&ö&B&VæFW&–ærÒÒÒÒÒÒÒÒÒÒ¢ð¢f"7FGW4Æ—7BÒ²væWrrÂv6öçF7FVBrÂvFÖ—GFVBrÂv6Æ÷6VBuÓ° ¢gVæ7F–öâ&VæFW"‚’°¢f"VçV—&–W2Ò7F÷&RævWB‚v§W6ÕöVçV—&–W2rÂµÒ“°¢f"ÖW76vW2Ò7F÷&RævWB‚v§W6ÕöÖW76vW2rÂµÒ“° ¢f"6÷VçG2Ò²æWs¢Â6öçF7FVC¢ÂFÖ—GFVC¢Â6Æ÷6VC¢Ó°¢VçV—&–W2æf÷$V6‚†gVæ7F–öâ‡’²–b†6÷VçG5·ç7FGW5ÒÓÒVæFVf–æVB’6÷VçG5·ç7FGW5Ò²³²Ò“° ¢B‚r66†—F÷FÂr’çFW‡D6öçFVçBÒVçV—&–W2æÆVæwFƒ°¢B‚r66†—æWrr’çFW‡D6öçFVçBÒ6÷VçG2ææWs°¢B‚r66†—6öçF7FVBr’çFW‡D6öçFVçBÒ6÷VçG2æ6öçF7FVC°¢B‚r66†—FÖ—GFVBr’çFW‡D6öçFVçBÒ6÷VçG2æFÖ—GFVC° ¢&VæFW%F&ÆR†VçV—&–W2ÂÖW76vW2“°¢Ð ¢gVæ7F–öâf×DFFR†—6ò’°¢f"BÒæWrFFR†—6ò“°¢–b†—4æâ†B’’&WGW&â—6òÇÂrs°¢&WGW&âBçFôÆö6ÆTFFU7G&–ær‚vVâÔ”ârÂ²F“¢s"ÖF–v—BrÂÖöçFƒ¢w6†÷'BrÂ–V#¢vçVÖW&–2rÒ’°¢rr²BçFôÆö6ÆUF–ÖU7G&–ær‚vVâÔ”ârÂ²†÷W#¢s"ÖF–v—BrÂÖ–çWFS¢s"ÖF–v—BrÒ“°¢Ð ¢gVæ7F–öâ7W'&VçEF"‚’°¢f"7F—fRÒB‚rçF"æ7F—fRr“°¢&WGW&â7F—fRò7F—fRævWDGG&–'WFR‚vFF×F"r’¢vVçV—&–W2s°¢Ð ¢gVæ7F–öâ&VæFW%F&ÆR‚’°¢f"F"Ò7W'&VçEF"‚“°¢f"6V&6‚Ò‚B‚r76V&6„&÷‚r’òB‚r76V&6„&÷‚r’çfÇVR¢rr’çFôÆ÷vW$66R‚“°¢f"F&öG’ÒB‚r7F&ÆT&öG’r“°¢f"&÷w2ÒµÓ° ¢–b‡F"ÓÓÒvVçV—&–W2r’°¢&÷w2Ò7F÷&RævWB‚v§W6ÕöVçV—&–W2rÂµÒ’æf–ÇFW"†gVæ7F–öâ‡’°¢&WGW&â6V&6‚ÇÂ‡ææÖR²rr²æ6÷W'6R²rr²ç†öæR²rr²æ–B’çFôÆ÷vW$66R‚’æ–æFW„öb‡6V&6‚’ÓÒÓ°¢Ò“°¢B‚r6Vç6÷VçBr’çFW‡D6öçFVçBÒ&÷w2æÆVæwF‚²rVçV—"r²‡&÷w2æÆVæwF‚ÓÓÒòw’r¢v–W2r“°¢–b‚&÷w2æÆVæwF‚’°¢F&öG’æ–ææW$…DÔÂÒsÇG#ãÇFB6öÇ7ãÒ#r"6Æ73Ò&V×G’#äæòVçV—&–W2–WBâ7V&Ö—BF†RFÖ—76–öâf÷&ÒFò6VR—B†W&RãÂ÷FCãÂ÷G#âs°¢&WGW&ã°¢Ð¢F&öG’æ–ææW$…DÔÂÒ&÷w2æÖ†gVæ7F–öâ‡Â’’°¢&WGW&âsÇG#âr°¢sÇFCãÇ7G&öæsâr²W62‡æ–B’²sÂ÷7G&öæsãÂ÷FCâr°¢sÇFBFFÖÆ&VÃÒ$FFR#âr²f×DFFR‡æ7&VFVDB’²sÂ÷FCâr°¢sÇFBFFÖÆ&VÃÒ$æÖR#âr²W62‡ææÖR’²sÆ'#ãÇ7â6Æ73Ò&×WFVB#ç2öòr²W62‡æfF†W"ÇÂuÇS#Br’²sÂ÷7ããÂ÷FCâr°¢sÇFBFFÖÆ&VÃÒ$6÷W'6R#âr²W62‡æ6÷W'6R’²sÂ÷FCâr°¢sÇFBFFÖÆ&VÃÒ%†öæR#âr²W62‡ç†öæR’²sÂ÷FCâr°¢sÇFBFFÖÆ&VÃÒ%7FGW2#ãÇ6VÆV7B6Æ73Ò&–6öâÖ'Fâ7FGW56VÂ"FFÖ–CÒ"r²W62‡æ–B’²r#âr°¢7FGW4Æ—7BæÖ†gVæ7F–öâ‡2’°¢&WGW&âsÆ÷F–öâfÇVSÒ"r²2²r"r²‡ç7FGW2ÓÓÒ2òr6VÆV7FVBr¢rr’²sâr²2æ6†$Bƒ’çFõWW$66R‚’²2ç6Æ–6Rƒ’²sÂö÷F–óâs°¢Ò’æ¦ö–â‚rr’²sÂ÷6VÆV7CãÂ÷FCâr°¢sÇFCãÆF—b6Æ73Ò'&÷rÖ7F–öç2#âr°¢sÆ'WGFöâ6Æ73Ò&–6öâÖ'Fâ"FF×f–WsÒ"r²W62‡æ–B’²r#åf–WsÂö'WGFöãâr°¢sÆ'WGFöâ6Æ73Ò&–6öâÖ'FâFVÂ"FFÖFVÃÒ"r²W62‡æ–B’²r#äFVÆWFSÂö'WGFöãâr°¢sÂöF—cãÂ÷FCâr°¢sÂ÷G#âs°¢Ò’æ¦ö–â‚rr“°¢ÒVÇ6R°¢&÷w2Ò7F÷&RævWB‚v§W6ÕöÖW76vW2rÂµÒ’æf–ÇFW"†gVæ7F–öâ†Ò’°¢&WGW&â6V&6‚ÇÂ†ÒææÖR²rr²Òç7V&¦V7B²rr²Òç†öæR²rr²Òæ–B’çFôÆ÷vW$66R‚’æ–æFW„öb‡6V&6‚’ÓÒÓ°¢Ò“°¢B‚r6Vç6÷VçBr’çFW‡D6öçFVçBÒ&÷w2æÆVæwF‚²rÖW76vRr²‡&÷w2æÆVæwF‚ÓÓÒòrr¢w2r“°¢–b‚&÷w2æÆVæwF‚’°¢F&öG’æ–ææW$…DÔÂÒsÇG#ãÇFB6öÇ7ãÒ#b"6Æ73Ò&V×G’#äæòÖW76vW2–WBâÖW76vW2g&öÒF†R6öçF7BvRV"†W&RãÂ÷FCãÂ÷G#âs°¢&WGW&ã°¢Ð¢F&öG’æ–ææW$…DÔÂÒ&÷w2æÖ†gVæ7F–öâ†Ò’°¢&WGW&âsÇG#âr°¢sÇFCãÇ7G&öæsâr²W62†Òæ–B’²sÂ÷7G&öæsãÂ÷FCâr°¢sÇFBFFÖÆ&VÃÒ$FFR#âr²f×DFFR†Òæ7&VFVDB’²sÂ÷FCâr°¢sÇFBFFÖÆ&VÃÒ$æÖR#âr²W62†ÒææÖR’²sÂ÷FCâr°¢sÇFBFFÖÆ&VÃÒ%†öæR#âr²W62†Òç†öæR’²†ÒæVÖ–ÂòsÆ'#ãÇ7â6Æ73Ò&×WFVB#âr²W62†ÒæVÖ–Â’²sÂ÷7ãâr¢rr’²sÂ÷FCâr°¢sÇFBFFÖÆ&VÃÒ%7V&¦V7B#âr²W62†Òç7V&¦V7BÇÂuÇS#Br’²sÂ÷FCâr°¢sÇFCãÆF—b6Æ73Ò'&÷rÖ7F–öç2#âr°¢sÆ'WGFöâ6Æ73Ò&–6öâÖ'Fâ"FF×f–Wv×6sÒ"r²W62†Òæ–B’²r#åf–WsÂö'WGFöãâr°¢sÆ'WGFöâ6Æ73Ò&–6öâÖ'FâFVÂ"FFÖFVÆ×6sÒ"r²W62†Òæ–B’²r#äFVÆWFSÂö'WGFöãâr°¢sÂöF—cãÂ÷FCâr°¢sÂ÷G#âs°¢Ò’æ¦ö–â‚rr“°¢Ð¢Ð ¢ò¢ÒÒÒÒÒÒÒÒÒÒÒF'2òFööÆ&"WfVçG2ÒÒÒÒÒÒÒÒÒÒ¢ð¢BB‚rçF"r’æf÷$V6‚†gVæ7F–öâ‡F"’°¢F"æFDWfVçDÆ—7FVæW"‚v6Æ–6²rÂgVæ7F–öâ‚’°¢BB‚rçF"r’æf÷$V6‚†gVæ7F–öâ‡B’²Bæ6Æ74Æ—7Bç&VÖ÷fR‚v7F—fRr“²Ò“°¢F"æ6Æ74Æ—7BæFB‚v7F—fRr“°¢&VæFW%F&ÆR‚“°¢Ò“°¢Ò“° ¢f"6V&6„&÷‚ÒB‚r76V&6„&÷‚r“°¢–b‡6V&6„&÷‚’6V&6„&÷‚æFDWfVçDÆ—7FVæW"‚v–çWBrÂ&VæFW%F&ÆR“° ¢f"W‡÷'D'FâÒB‚r6W‡÷'D'Fâr“°¢–b†W‡÷'D'Fâ’°¢W‡÷'D'FâæFDWfVçDÆ—7FVæW"‚v6Æ–6²rÂgVæ7F–öâ‚’°¢f"FFÒ7F÷&RævWB‚v§W6ÕöVçV—&–W2rÂµÒ“°¢–b‚FFæÆVæwF‚’²ÆW'B‚tæòVçV—&–W2FòW‡÷'Bâr“²&WGW&ã²Ð¢f"†VBÒ²tVçV—'’”BrÂtFFRrÂtæÖRrÂ$fF†W"w2æÖR"ÂtDô"rÂtvVæFW"rÂt6÷W'6RrÂu†öæRrÂtVÖ–ÂrÂtFG&W72rÂu&Wf–÷W2VGV6F–öârÂtÖW76vRrÂu7FGW2uÓ°¢f"Æ–æW2Ò¶†VBæ¦ö–â‚rÂr•Ó°¢FFæf÷$V6‚†gVæ7F–öâ‡’°¢Æ–æW2çW6‚…°¢æ–BÂæ7&VFVDBÂææÖRÂæfF†W"ÂæFö"ÂævVæFW"Âæ6÷W'6RÂç†öæRÂæVÖ–ÂÀ¢æFG&W72Âç&Wf–÷W2ÂæÖW76vRÂç7FGW0¢ÒæÖ†gVæ7F–öâ‡b’°¢&WGW&âr"r²7G&–ær‡bÓÒçVÆÂòrr¢b’ç&WÆ6R‚ò"örÂr""r’²r"s°¢Ò’æ¦ö–â‚rÂr’“°¢Ò“°¢F÷væÆöB‚v¦Ö–×W6Öæ–ÖVçV—&–W2Òr²æWrFFR‚’çFô•4õ5G&–ær‚’ç6Æ–6RƒÂ’²ræ77brÂÆ–æW2æ¦ö–â‚uÆâr’ÂwFW‡Bö77br“°¢Ò“°¢Ð ¢f"6ÆV$'FâÒB‚r66ÆV$'Fâr“°¢–b†6ÆV$'Fâ’°¢6ÆV$'FâæFDWfVçDÆ—7FVæW"‚v6Æ–6²rÂgVæ7F–öâ‚’°¢–b†7W'&VçEF"‚’ÓÒvVçV—&–W2r’°¢–b†6öæf—&Ò‚tFVÆWFR~ÆÂ6öçF7BÖW76vW3òF†—26ææ÷B&RVæFöæRâr’’°¢7F÷&Rç6WB‚v§W6ÕöÖW76vW2rÂµÒ“°¢&VæFW"‚“°¢Ð¢&WGW&ã°¢Ð¢–b†6öæf—&Ò‚tFVÆWFRÄÂFÖ—76–öâVçV—&–W3òF†—26ææ÷B&RVæFöæRâr’’°¢7F÷&Rç6WB‚v§W6ÕöVçV—&–W2rÂµÒ“°¢&VæFW"‚“°¢Ð¢Ò“°¢Ð ¢ò¢F&ÆR7F–öç2†WfVçBFVÆWF–öâ’¢ð¢Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚v6Æ–6²rÂgVæ7F–öâ†R’°¢f"f–WrÒRçF&vWBævWDGG&–'WFRbbRçF&vWBævWDGG&–'WFR‚vFF×f–Wrr“°¢f"FVÂÒRçF&vWBævWDGG&–'WFRbbRçF&vWBævWDGG&–'WFR‚vFFÖFVÂr“°¢f"f–Wt×6rÒRçF&vWBævWDGG&–'WFRbbRçF&vWBævWDGG&–'WFR‚vFF×f–Wt×6rr“°¢f"FVÄ×6rÒRçF&vWBævWDGG&–'WFRbbRçF&vWBævWDGG&–'WFR‚vFFÖFVÆ×6rr“° ¢–b‡f–Wr’°¢f"Ò7F÷&RævWB‚v§W6ÕöVçV—&–W2rÂµÒ’æf–æB†gVæ7F–öâ‡‚’²&WGW&â‚æ–BÓÓÒf–Ws²Ò“°¢–b‡’°¢ÆW'B€¢tVçV—'’r²æ–B²uÆâr°¢rÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÕÆâr°¢tæÖS¢r²ææÖR²uÆâr°¢$fF†W"w2æÖS¢"²æfF†W"²uÆâr°¢tDô#¢r²æFö"²rvVæFW#¢r²ævVæFW"²uÆâr°¢t6÷W'6S¢r²æ6÷W'6R²uÆâr°¢u†öæS¢r²ç†öæR²uÆâr°¢tVÖ–Ã¢r²‡æVÖ–ÂÇÂuÇS#Br’²uÆâr°¢tFG&W73¢r²æFG&W72²uÆâr°¢u&Wf–÷W2VGV6F–öã¢r²‡ç&Wf–÷W2ÇÂuÇS#Br’²uÆâr°¢tÖW76vS¢r²‡æÖW76vRÇÂuÇS#Br’²uÆâr°¢u7V&Ö—GFVC¢r²f×DFFR‡æ7&VFVDB’²uÆâr°¢u7FGW3¢r²ç7FGW0¢“°¢Ð¢Ð¢–b†FVÂ’°¢–b†6öæf—&Ò‚tFVÆWFRVçV—'’r²FVÂ²sòr’’’°¢7F÷&Rç6WB‚v§W6ÕöVçV—&–W2rÂ7F÷&RævWB‚v§W6ÕöVçV—&–W2rÂµÒ’æf–ÇFW"†gVæ7F–öâ‡‚’²&WGW&â‚æ–BÓÒFVÃ²Ò’“°¢&VæFW"‚“°¢Ð¢Ð¢–b‡f–Wt×6r’°¢f"ÒÒ7F÷&RævWB‚v§W6ÕöÖW76vW2rÂµÒ’æf–æB†gVæ7F–öâ‡‚’²&WGW&â‚æ–BÓÓÒf–Wt×6s²Ò“°¢–b†Ò’°¢ÆW'B€¢tÖW76vRr²Òæ–B²uÆâr°¢rÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÒÕÆâr°¢tæÖS¢r²ÒææÖR²uÆâr°¢u†öæS¢r²Òç†öæR²uÆâr°¢tVÖ–Ã¢r²†ÒæVÖ–ÂÇÂuÇS#Br’²uÆâr°¢u7V&¦V7C¢r²†Òç7V&¦V7BÇÂuÇS#Br’²uÆâr°¢tÖW76vS¢r²ÒæÖW76vR²uÆâr°¢u7V&Ö—GFVC¢r²f×DFFR†Òæ7&VFVDB¢“°¢Ð¢Ð¢–b†FVÄ×6r’°¢–b†6öæf—&Ò‚tFVÆWFRÖW76vRr²FVÄ×6r²sòr’’’°¢7F÷&Rç6WB‚v§W6ÕöÖW76vW2rÂ7F÷&RævWB‚v§W6ÕöÖW76vW2rÂµÒ’æf–ÇFW"†gVæ7F–öâ‡‚’²&WGW&â‚æ–BÓÒFVÄ×6s²Ò’“°¢&VæFW"‚“°¢Ð¢Ð¢Ò“° ¢Fö7VÖVçBæFDWfVçDÆ—7FVæW"‚v6†ævRrÂgVæ7F–öâ†R’°¢–b†RçF&vWBæ6Æ74Æ—7BbbRçF&vWBæ6Æ74Æ—7Bæ6öçF–ç2‚w7FGW56VÂr’’°¢f"–BÒRçF&vWBævWDGG&–'WFR‚vFFÖ–Br“°¢f"Æ—7BÒ7F÷&RævWB‚v§W6ÕöVçV—&–W2rÂµÒ“°¢f"—FVÒÒÆ—7Bæf–æB†gVæ7F–öâ‡‚’²&WGW&â‚æ–BÓÓÒ–C²Ò“°¢–b†—FVÒ’°¢—FVÒç7FGW2ÒRçF&vWBçfÇVS°¢7F÷&Rç6WB‚v§W6ÕöVçV—&–W2rÂÆ—7B“°¢&VæFW"‚“°¢Ð¢Ð¢Ò“° ¢ò¢ÒÒÒÒÒÒÒÒÒÒÒ6†ævR77v÷&BÒÒÒÒÒÒÒÒÒÒ¢ð¢f"tf÷&ÒÒB‚r7tf÷&Òr“°¢–b‡tf÷&Ò’°¢tf÷&ÒæFDWfVçDÆ—7FVæW"‚w7V&Ö—BrÂgVæ7F–öâ†R’°¢Rç&WfVçDFVfVÇB‚“°¢f"W'$VÂÒB‚r7tW'"r“°¢f"7&VG2ÒvWD7&VG2‚“°¢f"öÆErÒtf÷&ÒçtöÆBçfÇVS°¢f"æWurÒtf÷&ÒçtæWrçfÇVS°¢f"6öæerÒtf÷&Òçt6öæbçfÇVS°¢–b†öÆErÓÒ7&VG2ç72’°¢W'$VÂçFW‡D6öçFVçBÒt7W'&VçB77v÷&B—2–æ6÷'&V7Bâs°¢W'$VÂæ6Æ74Æ—7BæFB‚w6†÷rr“°¢&WGW&ã°¢Ð¢–b†æWuræÆVæwF‚Âb’°¢W'$VÂçFW‡D6öçFVçBÒtæWr77v÷&B×W7B&RBÆV7Bb6†&7FW'2âs°¢W'$VÂæ6Æ74Æ—7BæFB‚w6†÷rr“°¢&WGW&ã°¢Ð¢–b†æWurÓÒ6öæer’°¢W'$VÂçFW‡D6öçFVçBÒtæWr77v÷&G2Fòæ÷BÖF6‚âs°¢W'$VÂæ6Æ74Æ—7BæFB‚w6†÷rr“°¢&WGW&ã°¢Ð¢7F÷&Rç6WB„5$TE5ô´U’Â²W6W#¢7&VG2çW6W"Â73¢æWurÒ“°¢tf÷&Òç&W6WB‚“°¢W'$VÂæ6Æ74Æ—7Bç&VÖ÷fR‚w6†÷rr“°¢ÆW'B‚u77v÷&B6†ævVB7V66W76gVÆÇ’âr“°¢Ò“°¢Ð ¢ò¢ÒÒÒÒÒÒÒÒÒÒ6öçFVçBVF—F÷"†ææ÷Væ6VÖVçG2òWfVçG2ò6÷W'6W2’ÒÒÒÒÒÒÒÒÒÒÒ¢ð¢f"õdU%$”DUô´U’Òv§W6Õö6öçFVçEö÷fW'&–FW2s° ¢gVæ7F–öâ7W'&VçDFF‚’°¢f"òÒ7F÷&RævWB„õdU%$”DUô´U’ÂçVÆÂ’ÇÂ·Ó°¢f"BÒv–æF÷rä¥U4ÒÇÂ·Ó°¢&WGW&â°¢ææ÷Væ6VÖVçG3¢òæææ÷Væ6VÖVçG2ÇÂBæææ÷Væ6VÖVçG2ÇÂµÒÀ¢WfVçG3¢òæWfVçG2ÇÂBæWfVçG2ÇÂµÒÀ¢6÷W'6W3¢òæ6÷W'6W2ÇÂBæ6÷W'6W2ÇÂµÐ¢Ó°¢Ð ¢v–æF÷ræÆöD6öçFVçDVF—F÷"ÒgVæ7F–öâ‚’°¢f"BÒ7W'&VçDFF‚“°¢B‚r67Dææ÷Væ6VÖVçG2r’çfÇVRÒBæææ÷Væ6VÖVçG2æ¦ö–â‚uÆâr“°¢B‚r67DWfVçG2r’çfÇVRÒBæWfVçG2æÖ†gVæ7F–öâ†R’°¢&WGW&âRæFFR²rÂr²RçF—FÆR²rÂr²RæFW63°¢Ò’æ¦ö–â‚uÆâr“°¢B‚r67D6÷W'6W2r’çfÇVRÒBæ6÷W'6W2æÖ†gVæ7F–öâ†2’°¢&WGW&â¶2æ–BÂ2ææÖRÂ2æGW&F–öâÂ2ç6VG2Â2æfVRÂ2æFÖ—76–öäfVRÂ2æVÆ–v–&–Æ—G’Â2æFW62Â2çFrÇÂrrÂ2çW&GRÇÂruÒæ¦ö–â‚rÂr“°¢Ò’æ¦ö–â‚uÆâr“°¢Ó° ¢f"6öçFVçE6fRÒB‚r66öçFVçE6fRr“°¢–b†6öçFVçE6fR’°¢6öçFVçE6fRæFDWfVçDÆ—7FVæW"‚v6Æ–6²rÂgVæ7F–öâ‚’°¢f"×6rÒB‚r66öçFVçD×6rr“°¢gVæ7F–öâ6†÷r‡FW‡BÂvööB’°¢×6ræ†–FFVâÒfÇ6S°¢×6rçFW‡D6öçFVçBÒFW‡C°¢×6rç7G–ÆRæ&÷&FW$ÆVgD6öÆ÷"ÒvööBòr3Cf#Fbr¢r633“&"s°¢×6rç7G–ÆRæ&6¶w&÷VæBÒvööBòr6Svc&V2r¢r6fFV6Vs°¢Ð¢gVæ7F–öâÆ–æW2†–B’°¢&WGW&âB†–B’çfÇVRç7Æ—B‚uÆâr’æÖ†gVæ7F–öâ‡2’²&WGW&â2çG&–Ò‚“²Ò’æf–ÇFW"†gVæ7F–öâ‡2’²&WGW&â2ÓÒrs²Ò“°¢Ð ¢ò¢ææ÷Væ6VÖVçG2¢ð¢f"ææ÷Væ6VÖVçG2ÒÆ–æW2‚r67Dææ÷Væ6VÖVçG2r“°¢–b‚ææ÷Væ6VÖVçG2æÆVæwF‚’°¢6†÷r‚tææ÷Væ6VÖVçG26ææ÷B&RV×G’âFBBÆV7BöæRÆ–æRÂ÷"W6R%&W6WBFòFVfVÇG2"ârÂfÇ6R“°¢&WGW&ã°¢Ð ¢ò¢WfVçG3¢FFRÂF—FÆRÂFW62¢ð¢f"WfVçG2ÒµÓ°¢f"&DWfVçBÒrs°¢Æ–æW2‚r67DWfVçG2r’æf÷$V6‚†gVæ7F–öâ†Æ–æR’°¢f"ÒÆ–æRç7Æ—B‚wÂr’æÖ†gVæ7F–öâ‡2’²&WGW&â2çG&–Ò‚“²Ò“°¢–b‡æÆVæwF‚Â2ÇÂõåÆG³GÒÕÆG³'ÒÕÆG³'ÒBòçFW7B‡³Ò’’²&DWfVçBÒÆ–æS²&WGW&ã²Ð¢WfVçG2çW6‚‡²FFS¢³ÒÂF—FÆS¢³ÒÂFW63¢ç6Æ–6Rƒ"’æ¦ö–â‚rÂr’Ò“°¢Ò“°¢–b†&DWfVçB’°¢6†÷r‚uF†—2WfVçBÆ–æR—2æ÷BfÆ–C¢"r²&DWfVçB²r"âW6R•••’ÔÔÒÔDBÂF—FÆRÂFW67&—F–öârÂfÇ6R“°¢&WGW&ã°¢Ð ¢ò¢6÷W'6W3¢–BÂæÖRÂGW&F–öâÂ6VG2ÂfVRÂFÒfVRÂVÆ–v–&–Æ—G’ÂFW62ÂFrÂW&GR¢ð¢f"6÷W'6W2ÒµÓ°¢f"&D6÷W'6RÒrs°¢Æ–æW2‚r67D6÷W'6W2r’æf÷$V6‚†gVæ7F–öâ†Æ–æR’°¢f"ÒÆ–æRç7Æ—B‚wÂr’æÖ†gVæ7F–öâ‡2’²&WGW&â2çG&–Ò‚“²Ò“°¢–b‡æÆVæwF‚Â‚ÇÂ³ÒÇÂ³Ò’²&D6÷W'6RÒÆ–æS²&WGW&ã²Ð¢6÷W'6W2çW6‚‡°¢–C¢³ÒÂæÖS¢³ÒÂGW&F–öã¢³%ÒÀ¢6VG3¢'6T–çB‡³5ÒÂ’ÇÂÂfVS¢³EÒÂFÖ—76–öäfVS¢³UÒÀ¢VÆ–v–&–Æ—G“¢³eÒÂFW63¢³uÒÂFs¢³…ÒÇÂt6÷W'6RrÂW&GS¢³•ÒÇÂrp¢Ò“°¢Ò“°¢–b†&D6÷W'6R’°¢6†÷tÉ]¡¥Ì½ÕÉÍ”±¥¹”¹••‘Ì…Ð±•…ÍÐÑ¡”™¥ÉÍÐ€à™¥•±‘Ìè€ˆœ€¬‰…‘½ÕÉÍ”€¬€œˆ¸œ°™…±Í”¤ì(€€€€€€€€€É•ÑÕÉ¸ì(€€€€€ô((€€€€€ÍÑ½É”¹Í•Ð¡=YII%}-d°ì…¹¹½Õ¹•µ•¹ÑÌè…¹¹½Õ¹•µ•¹ÑÌ°•Ù•¹ÑÌè•Ù•¹ÑÌ°½ÕÉÍ•Ìè½ÕÉÍ•Ìô¤ì(€€€€€Í¡½Ý#sSaved! Refresh any page of the site to see your edits (they apply in this browser).', true);
    });
  }

  var contentReset = $('#contentReset');
  if (contentReset) {
    contentReset.addEventListener('click', function () {
      if (!confirm('Remove ALL content edits and restore the default content?')) return;
      localStorage.removeItem(OVERRIDE_KEY);
      window.loadContentEditor();
      var msg = $('#contentMsg');
      if (msg) {
          msg.hidden = false;
          msg.textContent = 'Defaults restored. Refresh the site pages to see them.';
          msg.style.borderLeftColor = '#0d6b4f';
            msg.style.background = '#e7f2ec';
        }
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
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
})();
