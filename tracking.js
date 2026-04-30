/**
 * Tidewater / sellmyhousefasthamptonroadsva.com — Conversion Tracking
 *
 * Wires form submits, phone clicks, and CTA clicks to Google Ads conversion AW-18052501312
 * Account: Tidewater Rental Properties LLC (446-550-1854)
 * Set up: 2026-04-30 by Claude
 */
(function () {
  'use strict';
  var AW_ID = 'AW-18052501312';
  var LABEL = '0agJCIrYoqUcEMCejaBD';
  var SEND_TO = AW_ID + '/' + LABEL;
  var LEAD_VALUE = 50.0, PHONE_VALUE = 25.0, CTA_VALUE = 5.0;

  function fire(value, eventLabel) {
    if (typeof gtag !== 'function') return;
    gtag('event', 'conversion', {
      send_to: SEND_TO,
      value: value,
      currency: 'USD',
      event_callback: function(){ console.log('[tracking] fired:', eventLabel); }
    });
  }
  function wireForm(f){ if(!f||f.dataset.tw==='1')return;f.dataset.tw='1';f.addEventListener('submit',function(){fire(LEAD_VALUE,'lead:'+(f.id||'form'));},{passive:true}); }
  function wirePhone(a){ if(!a||a.dataset.tw==='1')return;a.dataset.tw='1';a.addEventListener('click',function(){fire(PHONE_VALUE,'phone:'+(a.getAttribute('href')||''));},{passive:true}); }
  function wireCta(b){ if(!b||b.dataset.tw==='1')return;b.dataset.tw='1';b.addEventListener('click',function(){var t=(b.innerText||'').trim().toLowerCase();if(/get.*offer|cash.*offer|sell.*house|free.*offer|sell.*now/i.test(t))fire(CTA_VALUE,'cta:'+t.substring(0,40));},{passive:true}); }
  function wireAll(){
    document.querySelectorAll('form').forEach(wireForm);
    document.querySelectorAll('a[href^="tel:"]').forEach(wirePhone);
    document.querySelectorAll('button, a.cta-btn, a.btn, .cta-btn, [class*="cta"]').forEach(wireCta);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wireAll); else wireAll();
  if(typeof MutationObserver!=='undefined'){new MutationObserver(wireAll).observe(document.documentElement,{childList:true,subtree:true});}
})();
