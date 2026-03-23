/* ============================================================
   Pino Landscaping – World Clock
   Updates every second using Intl.DateTimeFormat (no libraries)
   ============================================================ */

(function () {
  'use strict';

  var ZONES = [
    { id: 'local',        city: 'Local',       tz: null,                     label: 'Your Time'  },
    { id: 'new-york',     city: 'New York',     tz: 'America/New_York',       label: 'EST / EDT'  },
    { id: 'london',       city: 'London',       tz: 'Europe/London',          label: 'GMT / BST'  },
    { id: 'paris',        city: 'Paris',        tz: 'Europe/Paris',           label: 'CET / CEST' },
    { id: 'dubai',        city: 'Dubai',        tz: 'Asia/Dubai',             label: 'GST'        },
    { id: 'tokyo',        city: 'Tokyo',        tz: 'Asia/Tokyo',             label: 'JST'        },
    { id: 'sydney',       city: 'Sydney',       tz: 'Australia/Sydney',       label: 'AEST / AEDT'},
    { id: 'los-angeles',  city: 'Los Angeles',  tz: 'America/Los_Angeles',    label: 'PST / PDT'  }
  ];

  /* Build a formatter pair (time + date) for a timezone, or null for local. */
  function makeFormatters(tz) {
    var opts = { timeZone: tz || undefined };
    var timeFmt = new Intl.DateTimeFormat('en-US', Object.assign({}, opts, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }));
    var dateFmt = new Intl.DateTimeFormat('en-US', Object.assign({}, opts, {
      weekday: 'short',
      month:   'short',
      day:     'numeric',
      year:    'numeric'
    }));
    var offsetFmt = new Intl.DateTimeFormat('en-US', Object.assign({}, opts, {
      timeZoneName: 'short'
    }));
    return { timeFmt: timeFmt, dateFmt: dateFmt, offsetFmt: offsetFmt };
  }

  /* Extract the UTC offset label from a formatted string, e.g. "GMT+4" */
  function getOffsetLabel(offsetFmt, date) {
    var parts = offsetFmt.formatToParts(date);
    var tzPart = parts.find(function (p) { return p.type === 'timeZoneName'; });
    return tzPart ? tzPart.value : '';
  }

  /* Build the DOM card for one timezone entry */
  function buildCard(zone, formatters) {
    var card = document.createElement('div');
    card.className = 'clock-card' + (zone.id === 'local' ? ' clock-card--local' : '');
    card.setAttribute('aria-label', zone.city + ' clock');

    var cityEl   = document.createElement('div');
    cityEl.className = 'clock-card__city';
    cityEl.textContent = zone.city;

    var badgeEl  = document.createElement('div');
    badgeEl.className = 'clock-card__badge';
    badgeEl.textContent = zone.label;

    var timeEl   = document.createElement('div');
    timeEl.className = 'clock-card__time';
    timeEl.setAttribute('aria-live', 'polite');
    timeEl.setAttribute('aria-atomic', 'true');

    var dateEl   = document.createElement('div');
    dateEl.className = 'clock-card__date';

    var offsetEl = document.createElement('div');
    offsetEl.className = 'clock-card__offset';

    card.appendChild(cityEl);
    card.appendChild(badgeEl);
    card.appendChild(timeEl);
    card.appendChild(dateEl);
    card.appendChild(offsetEl);

    /* Store references for fast updates */
    zone._timeEl   = timeEl;
    zone._dateEl   = dateEl;
    zone._offsetEl = offsetEl;
    zone._fmts     = formatters;

    return card;
  }

  /* Update a single card's time/date/offset display */
  function updateCard(zone, now) {
    zone._timeEl.textContent   = zone._fmts.timeFmt.format(now);
    zone._dateEl.textContent   = zone._fmts.dateFmt.format(now);
    zone._offsetEl.textContent = getOffsetLabel(zone._fmts.offsetFmt, now);
  }

  /* Initialise the clock grid */
  function init() {
    var grid = document.getElementById('clock-grid');
    if (!grid) return;

    /* Build formatters and cards */
    ZONES.forEach(function (zone) {
      var fmts = makeFormatters(zone.tz);
      var card = buildCard(zone, fmts);
      grid.appendChild(card);
    });

    /* First render immediately, then every second */
    function tick() {
      var now = new Date();
      ZONES.forEach(function (zone) { updateCard(zone, now); });
    }

    tick();
    setInterval(tick, 1000);
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
