/* ===== Carita Onboarding — app.js ===== */

(function () {
  'use strict';

  /* ---------- Config ---------- */
  const SUPABASE_URL = 'https://czfzbmcduafcxxrpdkvt.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZnpibWNkdWFmY3h4cnBka3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MjE1MjIsImV4cCI6MjA5MDQ5NzUyMn0.tveJ7h-Jb-Dv0j1PVPbKd5hlqnn9BvaTrD2URIuTw6I';
  const TOTAL_SCREENS = 12;

  /* ---------- State ---------- */
  const state = {
    current: 0,
    ref: new URLSearchParams(window.location.search).get('ref') || '',
    data: {
      first_name: '',
      relationship: '',
      country: '',
      parent_name: '',
      parent_country: '',
      parent_city: '',
      living_situation: '',
      care_duration: '',
      triggers: [],
      hardest_parts: [],
      coordination: [],
      conditions: [],
      notes: '',
    },
    submitting: false,
  };

  /* ---------- DOM refs ---------- */
  const $progressFill = document.querySelector('.progress-bar__fill');
  const $screens = Array.from(document.querySelectorAll('.screen'));
  const $completion = document.querySelector('.completion');

  /* ---------- Haptics ---------- */
  function haptic(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  /* ---------- Countries list (top countries first, then alphabetical) ---------- */
  const TOP_COUNTRIES = [
    'Australia', 'Canada', 'Hong Kong', 'Ireland', 'Malaysia',
    'New Zealand', 'Philippines', 'Singapore', 'South Africa',
    'United Kingdom', 'United States',
  ];
  const ALL_COUNTRIES = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina',
    'Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados',
    'Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana',
    'Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon',
    'Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo',
    'Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica',
    'Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia',
    'Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana',
    'Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hong Kong',
    'Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica',
    'Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia',
    'Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar',
    'Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius',
    'Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique',
    'Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria',
    'North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Palestine','Panama',
    'Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania',
    'Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines',
    'Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles',
    'Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa',
    'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland',
    'Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga',
    'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine',
    'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu',
    'Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
  ];

  /* Build ordered list: top countries, divider, then rest */
  function getCountryList() {
    const topSet = new Set(TOP_COUNTRIES);
    const rest = ALL_COUNTRIES.filter(c => !topSet.has(c));
    return { top: TOP_COUNTRIES, rest };
  }

  /* ---------- Auto-detect country from locale ---------- */
  function detectCountry() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const locale = navigator.language || '';
      const map = {
        'AU': 'Australia', 'US': 'United States', 'GB': 'United Kingdom',
        'CA': 'Canada', 'NZ': 'New Zealand', 'SG': 'Singapore',
        'MY': 'Malaysia', 'PH': 'Philippines', 'HK': 'Hong Kong',
        'IE': 'Ireland', 'ZA': 'South Africa', 'IN': 'India',
      };
      const tzMap = {
        'Australia': 'Australia', 'America/New_York': 'United States',
        'America/Chicago': 'United States', 'America/Denver': 'United States',
        'America/Los_Angeles': 'United States', 'America/Toronto': 'Canada',
        'America/Vancouver': 'Canada', 'Europe/London': 'United Kingdom',
        'Europe/Dublin': 'Ireland', 'Asia/Singapore': 'Singapore',
        'Asia/Kuala_Lumpur': 'Malaysia', 'Asia/Manila': 'Philippines',
        'Asia/Hong_Kong': 'Hong Kong', 'Pacific/Auckland': 'New Zealand',
        'Africa/Johannesburg': 'South Africa', 'Asia/Kolkata': 'India',
      };
      /* Try timezone first */
      for (const [key, val] of Object.entries(tzMap)) {
        if (tz.startsWith(key) || tz === key) return val;
      }
      /* Fallback to locale */
      const cc = locale.split('-').pop().toUpperCase();
      if (map[cc]) return map[cc];
    } catch (_) { /* ignore */ }
    return '';
  }

  /* ---------- Progress ---------- */
  function updateProgress() {
    const pct = ((state.current + 1) / (TOTAL_SCREENS + 1)) * 100;
    $progressFill.style.width = pct + '%';
  }

  /* ---------- Dynamic parent name injection ---------- */
  function injectParentName() {
    const name = state.data.parent_name || 'your loved one';
    document.querySelectorAll('.parent-name').forEach(el => {
      el.textContent = name;
    });
  }

  /* ---------- Screen transitions ---------- */
  function goTo(index, direction) {
    if (index < 0 || index > TOTAL_SCREENS) return;
    const prev = $screens[state.current];
    const next = index === TOTAL_SCREENS ? null : $screens[index];

    haptic(5);

    /* Exit current screen */
    prev.classList.remove('active');
    prev.classList.add(direction === 'forward' ? 'exit-left' : 'exit-right');
    setTimeout(() => {
      prev.classList.remove('exit-left', 'exit-right');
    }, 300);

    if (index === TOTAL_SCREENS) {
      /* Show completion */
      state.current = index;
      updateProgress();
      showCompletion();
      return;
    }

    /* Prepare next screen entrance */
    next.classList.remove('exit-left', 'exit-right');
    next.style.transform = direction === 'forward' ? 'translateX(30px)' : 'translateX(-30px)';
    next.style.opacity = '0';

    /* Force reflow */
    void next.offsetWidth;

    next.style.transform = '';
    next.style.opacity = '';
    next.classList.add('active');

    state.current = index;
    updateProgress();
    injectParentName();

    /* Auto-focus text inputs */
    const input = next.querySelector('.text-input, .text-area, .dropdown-input');
    if (input) {
      setTimeout(() => input.focus(), 350);
    }

    updateContinueBtn(index);
  }

  /* ---------- Continue button state ---------- */
  function updateContinueBtn(index) {
    const screen = $screens[index];
    if (!screen) return;
    const btn = screen.querySelector('.btn-continue');
    if (!btn) return;

    const key = screen.dataset.key;
    const val = state.data[key];
    let valid = false;

    if (Array.isArray(val)) {
      valid = val.length > 0;
    } else if (typeof val === 'string') {
      valid = val.trim().length > 0;
    }

    /* Screens 11, 12 (conditions, notes) are optional */
    if (index === 10 || index === 11) valid = true;

    btn.disabled = !valid;
  }

  /* ---------- Validation ---------- */
  function validate(index) {
    const screen = $screens[index];
    const key = screen.dataset.key;
    const val = state.data[key];

    /* Optional screens */
    if (index === 10 || index === 11) return true;

    if (Array.isArray(val)) return val.length > 0;
    return typeof val === 'string' && val.trim().length > 0;
  }

  function showError(screen, msg) {
    const input = screen.querySelector('.text-input, .text-area, .dropdown-input');
    const errEl = screen.querySelector('.input-error');
    if (input) {
      input.classList.add('error');
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 400);
    }
    if (errEl) errEl.textContent = msg;
    haptic([15, 30, 15]);
  }

  function clearError(screen) {
    const input = screen.querySelector('.text-input, .text-area, .dropdown-input');
    const errEl = screen.querySelector('.input-error');
    if (input) input.classList.remove('error');
    if (errEl) errEl.textContent = '';
  }

  /* ---------- Option cards (single-select) ---------- */
  function initOptionCards() {
    document.querySelectorAll('.options-grid').forEach(grid => {
      const screen = grid.closest('.screen');
      const key = screen.dataset.key;

      grid.addEventListener('click', e => {
        const card = e.target.closest('.option-card');
        if (!card) return;

        haptic(10);
        grid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        /* Handle "Other" free-text input */
        const otherInput = screen.querySelector('.other-input');
        if (otherInput) {
          if (card.dataset.value === 'Other') {
            otherInput.style.display = 'block';
            otherInput.focus();
            state.data[key] = otherInput.value.trim() ? 'Other: ' + otherInput.value.trim() : '';
          } else {
            otherInput.style.display = 'none';
            otherInput.value = '';
            state.data[key] = card.dataset.value;
          }
        } else {
          state.data[key] = card.dataset.value;
        }
        updateContinueBtn(parseInt(screen.dataset.index, 10));
      });

      /* Listen for typing in "Other" free-text input */
      const otherInput = grid.closest('.screen').querySelector('.other-input');
      if (otherInput) {
        otherInput.addEventListener('input', () => {
          const val = otherInput.value.trim();
          state.data[key] = val ? 'Other: ' + val : '';
          updateContinueBtn(parseInt(screen.dataset.index, 10));
        });
      }
    });
  }

  /* ---------- Checkbox cards (multi-select) ---------- */
  function initCheckboxCards() {
    document.querySelectorAll('.checkbox-grid').forEach(grid => {
      const screen = grid.closest('.screen');
      const key = screen.dataset.key;

      grid.addEventListener('click', e => {
        const card = e.target.closest('.checkbox-card');
        if (!card) return;

        haptic(10);
        card.classList.toggle('selected');

        const selected = Array.from(grid.querySelectorAll('.checkbox-card.selected'))
          .map(c => c.dataset.value);
        state.data[key] = selected;
        updateContinueBtn(parseInt(screen.dataset.index, 10));
      });
    });
  }

  /* ---------- Searchable Dropdowns ---------- */
  function initDropdown(wrapEl, onSelect) {
    const input = wrapEl.querySelector('.dropdown-input');
    const list = wrapEl.querySelector('.dropdown-list');
    if (!input || !list) return;

    const { top, rest } = getCountryList();
    let highlighted = -1;
    let items = [];

    function render(filter) {
      list.innerHTML = '';
      const q = (filter || '').toLowerCase();
      const filtered = q
        ? ALL_COUNTRIES.filter(c => c.toLowerCase().includes(q))
        : [...top, '---', ...rest];

      items = [];
      filtered.forEach((c, i) => {
        if (c === '---') {
          const div = document.createElement('div');
          div.style.height = '1px';
          div.style.background = 'var(--border)';
          div.style.margin = '4px 0';
          list.appendChild(div);
          return;
        }
        const el = document.createElement('div');
        el.className = 'dropdown-item';
        el.textContent = c;
        el.dataset.value = c;
        if (c === input.dataset.selected) el.classList.add('selected');
        el.addEventListener('click', () => {
          select(c);
        });
        list.appendChild(el);
        items.push(el);
      });
      highlighted = -1;
    }

    function select(val) {
      input.value = val;
      input.dataset.selected = val;
      list.classList.remove('open');
      onSelect(val);
      haptic(10);
    }

    function highlightItem(idx) {
      items.forEach(i => i.classList.remove('highlighted'));
      if (idx >= 0 && idx < items.length) {
        items[idx].classList.add('highlighted');
        items[idx].scrollIntoView({ block: 'nearest' });
      }
      highlighted = idx;
    }

    input.addEventListener('focus', () => {
      render(input.value);
      list.classList.add('open');
    });

    input.addEventListener('input', () => {
      render(input.value);
      list.classList.add('open');
    });

    input.addEventListener('keydown', e => {
      if (!list.classList.contains('open')) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightItem(Math.min(highlighted + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightItem(Math.max(highlighted - 1, 0));
      } else if (e.key === 'Enter' && highlighted >= 0) {
        e.preventDefault();
        select(items[highlighted].dataset.value);
      } else if (e.key === 'Escape') {
        list.classList.remove('open');
      }
    });

    /* Close on click outside */
    document.addEventListener('click', e => {
      if (!wrapEl.contains(e.target)) list.classList.remove('open');
    });

    return { setDefault(val) { input.value = val; input.dataset.selected = val; } };
  }

  /* ---------- Text inputs ---------- */
  function initTextInputs() {
    document.querySelectorAll('.screen .text-input, .screen .text-area').forEach(input => {
      const screen = input.closest('.screen');
      const key = screen.dataset.key;

      /* Screen 5 (parent location) has its own handler in initScreen5 */
      if (screen.dataset.index === '4') return;

      input.addEventListener('input', () => {
        state.data[key] = input.value;
        clearError(screen);
        updateContinueBtn(parseInt(screen.dataset.index, 10));
      });

      /* Enter key to continue for single-line inputs */
      if (input.classList.contains('text-input')) {
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const btn = screen.querySelector('.btn-continue');
            if (btn && !btn.disabled) btn.click();
          }
        });
      }
    });
  }

  /* ---------- Navigation buttons ---------- */
  function initNavigation() {
    /* Continue buttons */
    document.querySelectorAll('.btn-continue').forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.closest('.screen');
        const idx = parseInt(screen.dataset.index, 10);

        if (!validate(idx)) {
          const name = state.data.first_name || 'your name';
          const msgs = {
            0: 'We need your name to continue',
            1: 'Please select your relationship',
            2: 'Please select your country',
            3: "Please let us know what to call them",
            4: 'Please tell us where they live',
            5: 'Please select a living situation',
            6: 'Please select how long',
            7: 'Please select at least one option',
            8: 'Please select at least one option',
            9: 'Please select at least one option',
          };
          showError(screen, msgs[idx] || 'Please answer this question');
          return;
        }

        haptic(8);

        /* If screen 3 (parent name) just answered, inject into subsequent screens */
        if (idx === 3) injectParentName();

        /* If last screen, submit */
        if (idx === TOTAL_SCREENS - 1) {
          submitForm(btn);
          return;
        }

        goTo(idx + 1, 'forward');
      });
    });

    /* Back buttons */
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.closest('.screen');
        const idx = parseInt(screen.dataset.index, 10);
        if (idx > 0) goTo(idx - 1, 'backward');
      });
    });

    /* Skip buttons */
    document.querySelectorAll('.btn-skip').forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.closest('.screen');
        const idx = parseInt(screen.dataset.index, 10);
        haptic(8);
        if (idx === TOTAL_SCREENS - 1) {
          submitForm(screen.querySelector('.btn-continue'));
        } else {
          goTo(idx + 1, 'forward');
        }
      });
    });
  }

  /* ---------- Swipe gestures ---------- */
  function initSwipe() {
    let startX = 0, startY = 0, tracking = false;

    document.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });

    document.addEventListener('touchend', e => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;

      if (dx < 0 && validate(state.current)) {
        /* Swipe left → next */
        if (state.current < TOTAL_SCREENS - 1) goTo(state.current + 1, 'forward');
      } else if (dx > 0 && state.current > 0) {
        /* Swipe right → back */
        goTo(state.current - 1, 'backward');
      }
    }, { passive: true });
  }

  /* ---------- Submit to Supabase ---------- */
  async function submitForm(btn) {
    if (state.submitting) return;
    state.submitting = true;

    btn.classList.add('loading');
    btn.disabled = true;
    haptic([10, 50, 10]);

    const d = state.data;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    const payload = {
      ref_hash: state.ref,
      first_name: d.first_name.trim(),
      relationship: d.relationship,
      country: d.country,
      parent_name: d.parent_name.trim(),
      parent_country: d.parent_country,
      parent_city: d.parent_city.trim(),
      living_situation: d.living_situation,
      care_duration: d.care_duration,
      triggers: d.triggers,
      hardest_parts: d.hardest_parts,
      coordination: d.coordination,
      conditions: d.conditions,
      notes: d.notes.trim(),
      timezone: tz,
      submitted_at: new Date().toISOString(),
    };

    try {
      /* If ref exists, update the pre-registered row; otherwise insert new */
      const headers = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=minimal,resolution=merge-duplicates',
      };

      const res = await fetch(SUPABASE_URL + '/rest/v1/onboarding_submissions', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error('Supabase error:', res.status, await res.text());
      }
    } catch (err) {
      console.error('Submit error:', err);
    }

    /* Always show completion regardless of API result */
    goTo(TOTAL_SCREENS, 'forward');
  }

  /* ---------- Completion screen ---------- */
  function showCompletion() {
    /* Hide progress bar */
    document.querySelector('.progress-bar').style.opacity = '0';

    /* Set dynamic names */
    const nameEl = $completion.querySelector('.completion__title');
    const subEl = $completion.querySelector('.completion__subtitle');
    nameEl.textContent = "You're all set, " + (state.data.first_name || 'there');
    subEl.textContent = 'Head back to WhatsApp \u2014 I\'m ready to help with ' +
      (state.data.parent_name || 'your loved one\'s') + '\'s care.';

    $completion.classList.add('active');
  }

  /* ---------- Screen 5 special: parent country + city ---------- */
  function initScreen5() {
    const screen5 = $screens[4]; // index 4
    const countryWrap = screen5.querySelector('.dropdown-wrap');
    const cityInput = screen5.querySelector('.text-input');

    const dropdown = initDropdown(countryWrap, val => {
      state.data.parent_country = val;
      updateScreen5Valid();
    });

    if (cityInput) {
      cityInput.addEventListener('input', () => {
        state.data.parent_city = cityInput.value;
        updateScreen5Valid();
      });
      cityInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const btn = screen5.querySelector('.btn-continue');
          if (btn && !btn.disabled) btn.click();
        }
      });
    }

    function updateScreen5Valid() {
      /* For screen 5, require at least country */
      const btn = screen5.querySelector('.btn-continue');
      btn.disabled = !state.data.parent_country;
    }
  }

  /* ---------- Init ---------- */
  function init() {
    /* Mark first screen active */
    $screens[0].classList.add('active');
    updateProgress();

    /* Init all interactive elements */
    initOptionCards();
    initCheckboxCards();
    initTextInputs();
    initNavigation();
    initSwipe();

    /* Screen 3 (country) — searchable dropdown */
    const screen3 = $screens[2]; // index 2
    const countryWrap3 = screen3.querySelector('.dropdown-wrap');
    const dd3 = initDropdown(countryWrap3, val => {
      state.data.country = val;
      updateContinueBtn(2);
    });

    /* Auto-detect country */
    const detected = detectCountry();
    if (detected) {
      dd3.setDefault(detected);
      state.data.country = detected;
      updateContinueBtn(2);
    }

    /* Screen 5 — parent location (country + city) */
    initScreen5();

    /* Auto-focus first input */
    const firstInput = $screens[0].querySelector('.text-input');
    if (firstInput) setTimeout(() => firstInput.focus(), 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
