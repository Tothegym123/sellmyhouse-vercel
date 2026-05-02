/**
 * Tidewater / sellmyhousefasthamptonroadsva.com — Conversion + Analytics Tracking (v3)
 *
 * Fires:
 *   - Google Ads phone-click conversion (AW-18052501312/0agJCIrYoqUcEMCejaBD, $25)
 *   - GA4 phone_click event (key event in Sell My House Fast Hampton Roads property)
 *   - GA4 generate_lead event on form submit (key event)
 *   - Form-submit → /thank-you/?lead=1 redirect (gives the async backend POST time to land)
 *   - Thank-you page-load Ads conversion is handled inline on /thank-you/.
 *
 * GA4 property: G-4FGQ3T9CX5 (Sell My House Fast Hampton Roads)
 * Google Ads account: AW-18052501312 (Tidewater Rental Properties LLC)
 */
(function () {
  'use strict';
  var ADS_PHONE_SEND_TO = 'AW-18052501312/0agJCIrYoqUcEMCejaBD';
  var GA4_ID = 'G-4FGQ3T9CX5';
  var PHONE_VALUE = 25.0;
  var LEAD_VALUE = 50.0;
  var REDIRECT_DELAY_MS = 800;
  var THANK_YOU_PATH = '/thank-you/?lead=1';

  if (/\/thank-you\/?/.test(window.location.pathname)) return;

  function firePhone(label) {
    if (typeof gtag !== 'function') return;
    var txid = 'phone_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    // Google Ads conversion (existing behavior — Smart Bidding signal)
    gtag('event', 'conversion', {
      send_to: ADS_PHONE_SEND_TO,
      value: PHONE_VALUE,
      currency: 'USD',
      transaction_id: txid
    });
    // GA4 phone_click event (new — feeds Engagement & Key Events reports)
    gtag('event', 'phone_click', {
      send_to: GA4_ID,
      phone_number: (label || '').replace(/^tel:/, ''),
      page_location: window.location.href,
      page_path: window.location.pathname,
      value: PHONE_VALUE,
      currency: 'USD'
    });
  }

  function fireFormLead(form) {
    if (typeof gtag !== 'function') return;
    var formId = (form && (form.id || form.name)) || 'unknown';
    var formAction = (form && form.getAttribute('action')) || '';
    // GA4 generate_lead event (the canonical GA4 lead event)
    gtag('event', 'generate_lead', {
      send_to: GA4_ID,
      form_id: formId,
      form_action: formAction,
      page_location: window.location.href,
      page_path: window.location.pathname,
      value: LEAD_VALUE,
      currency: 'USD'
    });
    // Also fire a clean form_submit event (auto-collected sometimes, but explicit is safer)
    gtag('event', 'form_submit', {
      send_to: GA4_ID,
      form_id: formId,
      page_path: window.location.pathname
    });
  }

  function wireForm(f) {
    if (!f || f.dataset.tw === '1') return;
    f.dataset.tw = '1';
    f.addEventListener('submit', function () {
      try { fireFormLead(f); } catch (e) {}
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
