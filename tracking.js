/**
 * Tidewater / sellmyhousefasthamptonroadsva.com — Conversion Tracking (v2)
 *
 * Fires Google Ads conversion AW-18052501312 from:
 *   - /thank-you/?lead=1 page-load (handled inline on that page)
 *   - tel: link clicks (phone intent)
 *
 * Form submits redirect to /thank-you/?lead=1 ~800ms after the submit event,
 * giving the existing async form handler time to POST to the backend before navigation.
 * CTA-click fires were removed — they were diluting the Smart Bidding signal.
 *
 * Account: Tidewater Rental Properties LLC (446-550-1854)
 */
(function () {
  'use strict';
  var SEND_TO = 'AW-18052501312/0agJCIrYoqUcEMCejaBD';
  var PHONE_VALUE = 25.0;
  var REDIRECT_DELAY_MS = 800;
  var THANK_YOU_PATH = '/thank-you/?lead=1';

  if (/\/thank-you\/?/.test(window.location.pathname)) return;

  function firePhone(label) {
    if (typeof gtag !== 'function') return;
    gtag('event', 'conversion', {
      send_to: SEND_TO,
      value: PHONE_VALUE,
      currency: 'USD',
      transaction_id: 'phone_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10)
    });
  }

  function wireForm(f) {
    if (!f || f.dataset.tw === '1') return;
    f.dataset.tw = '1';
    f.addEventListener('submit', function () {
      setTimeout(function () {
        if (!/\/thank-you\/?/.test(window.location.pathname)) {
          window.location.href = THANK_YOU_PATH;
        }
      }, REDIRECT_DELAY_MS);
    }, { passive: true });
  }

  function wirePhone(a) {
    if (!a || a.dataset.tw === '1') return;
    a.dataset.tw = '1';
    a.addEventListener('click', function () {
      firePhone(a.getAttribute('href') || '');
    }, { passive: true });
  }

  function wireAll() {
    document.querySelectorAll('form').forEach(wireForm);
    document.querySelectorAll('a[href^="tel:"]').forEach(wirePhone);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireAll);
  } else {
    wireAll();
  }

  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(wireAll).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
