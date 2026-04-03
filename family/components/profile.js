/* ========================================
   Editable Care Profile — profile.js
   ======================================== */

const ProfileSection = (() => {

  // Custom SVG icons for each profile section
  const sectionIcons = {
    about: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3.5 17.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    medications: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="5" y="2" width="10" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M7 8v9a1 1 0 001 1h4a1 1 0 001-1V8" stroke="currentColor" stroke-width="1.5"/>
      <path d="M7 12h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    healthcare: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2v4M10 14v4M18 10h-4M6 10H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 8v4M8 10h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    home: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 8l7-5 7 5v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 17v-5h4v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    transport: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 11V5a2 2 0 012-2h6a2 2 0 012 2v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <rect x="3" y="11" width="14" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="6.5" cy="17" r="1.5" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="13.5" cy="17" r="1.5" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,

    food: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 3v6a4 4 0 004 4h0V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 3v4M7 3v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M7 13v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M14 3v4c0 2.5 1 4 3 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 7h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M14 11v7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    routine: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 5.5V10l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    people: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="7" cy="7" r="3" stroke="currentColor" stroke-width="1.5"/>
      <path d="M1 17c0-3.31 2.69-6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="14" cy="7" r="2.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M19 17c0-2.76-2.24-5-5-5-1.38 0-2.63.56-3.54 1.46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  };

  const editIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const addIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;

  const chevronIcon = `<svg class="chevron-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const alertIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1l6 11H1L7 1z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 5.5v2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    <circle cx="7" cy="10" r="0.5" fill="currentColor"/>
  </svg>`;

  const checkSvg = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  // Track editing state per section
  let editingSection = null;

  function renderFieldsSection(section) {
    return section.fields.map(field => `
      <div class="profile-field">
        <span class="field-label">${field.label}</span>
        <span class="field-value editable"
              data-section="${section.key}"
              data-field="${field.key}"
              contenteditable="false"
              >${field.value}</span>
      </div>`).join('');
  }

  function renderListSection(section) {
    let html = section.items.map(item => `
      <div class="profile-list-item">
        <div class="list-item-primary editable"
             data-section="${section.key}"
             data-item-id="${item.id}"
             data-field="primary"
             contenteditable="false"
             >${item.primary}</div>
        ${item.secondary ? `<div class="list-item-secondary">${item.secondary}</div>` : ''}
      </div>`).join('');

    if (section.allergies && section.allergies.length > 0) {
      html += section.allergies.map(a => `
        <div class="allergy-tag">${alertIcon} ${a}</div>`).join('');
    }

    return html;
  }

  function renderPeopleSection(section) {
    return section.items.map(item => `
      <div class="profile-list-item">
        <div class="list-item-primary">${item.name} <span style="color: var(--text-tertiary); font-weight: 400">(${item.role})</span></div>
        <div class="list-item-secondary">${item.detail}</div>
      </div>`).join('');
  }

  function renderBulletSection(section) {
    return section.items.map(item => `
      <div class="profile-list-item">
        <div class="list-item-primary editable"
             data-section="${section.key}"
             data-field="bullet"
             contenteditable="false"
             >${item}</div>
      </div>`).join('');
  }

  function renderSectionBody(section) {
    switch (section.type) {
      case 'fields': return renderFieldsSection(section);
      case 'list': return renderListSection(section);
      case 'people': return renderPeopleSection(section);
      case 'bullets': return renderBulletSection(section);
      default: return '';
    }
  }

  function render(sections) {
    const container = document.getElementById('profile-sections');

    container.innerHTML = sections.map((section, i) => {
      const hasAdd = section.canAdd;
      const icon = sectionIcons[section.key] || sectionIcons.about;

      return `
        <div class="profile-section card-animate" id="section-${section.key}" style="animation-delay: ${i * 50}ms">
          <div class="profile-section-header" data-section="${section.key}">
            <div class="profile-section-left">
              <div class="profile-section-icon">${icon}</div>
              <span class="profile-section-name">${section.title}</span>
            </div>
            <div class="profile-section-actions">
              ${hasAdd ? `<button class="btn-add" data-add-section="${section.key}">${addIcon} Add</button>` : ''}
              <button class="btn-icon btn-edit" data-edit-section="${section.key}" title="Edit">${editIcon}</button>
              ${chevronIcon}
            </div>
          </div>
          <div class="profile-section-body">
            ${renderSectionBody(section)}
          </div>
        </div>`;
    }).join('');

    // Bind events
    bindToggle();
    bindEdit();
    bindAdd(sections);
  }

  function bindToggle() {
    document.querySelectorAll('.profile-section-header').forEach(header => {
      header.addEventListener('click', (e) => {
        // Don't toggle if clicking edit/add buttons
        if (e.target.closest('.btn-edit') || e.target.closest('.btn-add')) return;
        const section = header.closest('.profile-section');
        section.classList.toggle('collapsed');
      });
    });
  }

  function bindEdit() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sectionKey = btn.dataset.editSection;
        const sectionEl = document.getElementById(`section-${sectionKey}`);
        const editables = sectionEl.querySelectorAll('.editable');
        const isEditing = btn.classList.contains('editing');

        if (isEditing) {
          // Save
          btn.classList.remove('editing');
          editables.forEach(el => {
            el.contentEditable = 'false';
            el.classList.remove('editing');
          });
          showSaveConfirmation(btn);
          App.showToast('Changes saved');
        } else {
          // Enter edit mode
          btn.classList.add('editing');
          editables.forEach(el => {
            el.contentEditable = 'true';
            el.classList.add('editing');
          });
          // Expand if collapsed
          sectionEl.classList.remove('collapsed');
          // Focus first editable
          if (editables.length > 0) editables[0].focus();
        }
      });
    });
  }

  function bindAdd(sections) {
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sectionKey = btn.dataset.addSection;
        const section = sections.find(s => s.key === sectionKey);
        if (section) showAddModal(section);
      });
    });
  }

  function showSaveConfirmation(btn) {
    const flash = document.createElement('span');
    flash.className = 'save-flash';
    flash.innerHTML = `${checkSvg} Saved`;
    btn.parentNode.insertBefore(flash, btn.nextSibling);
    setTimeout(() => flash.remove(), 1500);
  }

  function showAddModal(section) {
    let fields = '';
    switch (section.key) {
      case 'medications':
        fields = `
          <div class="form-group"><label>Medication name</label><input type="text" id="add-primary" placeholder="e.g. Amlodipine 5mg"></div>
          <div class="form-group"><label>Instructions</label><input type="text" id="add-secondary" placeholder="e.g. every morning"></div>`;
        break;
      case 'healthcare':
        fields = `
          <div class="form-group"><label>Provider name</label><input type="text" id="add-primary" placeholder="e.g. Dr. Smith"></div>
          <div class="form-group"><label>Details</label><input type="text" id="add-secondary" placeholder="e.g. Westmead Medical, mornings"></div>`;
        break;
      case 'home':
        fields = `
          <div class="form-group"><label>Service name</label><input type="text" id="add-primary" placeholder="e.g. Gardener: Pete"></div>
          <div class="form-group"><label>Schedule / details</label><input type="text" id="add-secondary" placeholder="e.g. every 2nd Thursday"></div>`;
        break;
      case 'people':
        fields = `
          <div class="form-group"><label>Name</label><input type="text" id="add-primary" placeholder="e.g. Mary"></div>
          <div class="form-group"><label>Relationship</label><input type="text" id="add-secondary" placeholder="e.g. neighbour"></div>
          <div class="form-group"><label>Notes</label><input type="text" id="add-detail" placeholder="e.g. has a spare key"></div>`;
        break;
      default:
        fields = `
          <div class="form-group"><label>Entry</label><input type="text" id="add-primary" placeholder="Add new entry"></div>`;
    }

    const overlay = document.createElement('div');
    overlay.className = 'add-modal-overlay';
    overlay.innerHTML = `
      <div class="add-modal">
        <h3>Add to ${section.title}</h3>
        ${fields}
        <div class="modal-buttons">
          <button class="btn-secondary" id="modal-cancel">Cancel</button>
          <button class="btn-primary" id="modal-save">Add</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    // Focus first input
    setTimeout(() => overlay.querySelector('input')?.focus(), 100);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.getElementById('modal-cancel').addEventListener('click', () => overlay.remove());

    document.getElementById('modal-save').addEventListener('click', () => {
      const primary = document.getElementById('add-primary')?.value;
      if (!primary) return;

      const secondary = document.getElementById('add-secondary')?.value || '';
      const detail = document.getElementById('add-detail')?.value || '';

      // Add to the section body
      const sectionEl = document.getElementById(`section-${section.key}`);
      const body = sectionEl.querySelector('.profile-section-body');

      let newItemHTML = '';
      if (section.key === 'people') {
        newItemHTML = `
          <div class="profile-list-item card-animate">
            <div class="list-item-primary">${primary} <span style="color: var(--text-tertiary); font-weight: 400">(${secondary})</span></div>
            <div class="list-item-secondary">${detail}</div>
          </div>`;
      } else {
        newItemHTML = `
          <div class="profile-list-item card-animate">
            <div class="list-item-primary editable" contenteditable="false">${primary}</div>
            ${secondary ? `<div class="list-item-secondary">${secondary}</div>` : ''}
          </div>`;
      }

      body.insertAdjacentHTML('beforeend', newItemHTML);
      overlay.remove();
      App.showToast('Added successfully');

      // Ensure section is expanded
      sectionEl.classList.remove('collapsed');
    });
  }

  return { render };
})();
