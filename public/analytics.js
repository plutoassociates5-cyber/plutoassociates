/* Pluto Associates — GA4 analytics (G-99GSN723YH)
   Single source of truth for measurement: initial + SPA page views and
   conversion events (form_submit, whatsapp_click, phone_click).
   Loaded from index.html (SPA shell) and prerender.cjs STATIC_LINKS (all
   prerendered pages), so crawlers and visitors are both covered. */
(function () {
  var GA_ID = 'G-99GSN723YH';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: true });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  function trackPageView() {
    gtag('event', 'page_view', {
      page_location: location.href,
      page_path: location.pathname + location.search,
      page_title: document.title
    });
  }

  var originalPush = history.pushState;
  history.pushState = function () {
    originalPush.apply(this, arguments);
    trackPageView();
  };
  var originalReplace = history.replaceState;
  history.replaceState = function () {
    originalReplace.apply(this, arguments);
    trackPageView();
  };
  window.addEventListener('popstate', trackPageView);

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) {
      gtag('event', 'phone_click', { link_url: href });
    } else if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp://') !== -1 || href.indexOf('api.whatsapp.com') !== -1) {
      gtag('event', 'whatsapp_click', { link_url: href });
    }
  }, true);

  document.addEventListener('submit', function (e) {
    var form = e.target;
    gtag('event', 'form_submit', { form_id: form.id || (form.className || 'unknown') });
  }, true);
})();
