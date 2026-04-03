/* ========================================
   Calendar / Coming Up — calendar.js
   ======================================== */

const CalendarSection = (() => {

  // Custom SVG icons for event types
  const icons = {
    appointment: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 6v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    service: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10l2-7h10l2 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 10v6a1 1 0 001 1h12a1 1 0 001-1v-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 13h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    medication: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="2" width="10" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M7 8v9a1 1 0 001 1h4a1 1 0 001-1V8" stroke="currentColor" stroke-width="1.5"/>
      <path d="M7 12h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    garden: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M10 9C10 6 7 3 4 3c0 3 3 6 6 6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 12c0-3 3-6 6-6-3 0-6 3-6 6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 18h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    grocery: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5h1l1.5 8h6L15 7H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9" cy="16" r="1" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="13" cy="16" r="1" stroke="currentColor" stroke-width="1.5"/>
    </svg>`
  };

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  }

  function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  }

  function getIcon(type) {
    return icons[type] || icons.appointment;
  }

  function getIconClass(type) {
    if (type === 'medication') return 'type-medication';
    if (type === 'service' || type === 'garden' || type === 'grocery') return 'type-service';
    return 'type-appointment';
  }

  function render(events) {
    const container = document.getElementById('calendar-list');

    if (!events || events.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="8" width="36" height="34" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M6 18h36" stroke="currentColor" stroke-width="2"/>
              <path d="M16 4v8M32 4v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <p class="empty-state-text">No upcoming appointments yet — ask Carita to book one!</p>
        </div>`;
      return;
    }

    container.innerHTML = events.map((event, i) => {
      const dateLabel = formatDate(event.date);
      const timeLabel = event.time ? ` — ${formatTime(event.time)}` : '';
      const isUrgent = event.type === 'medication';

      return `
        <div class="calendar-card card-animate" style="animation-delay: ${i * 50}ms">
          <div class="card-icon ${getIconClass(event.type)}">
            ${getIcon(event.type)}
          </div>
          <div class="card-body">
            <div class="card-date ${isUrgent ? 'urgent' : ''}">${dateLabel}${timeLabel}</div>
            <div class="card-title">${event.title}</div>
            ${event.subtitle ? `<div class="card-subtitle">${event.subtitle}</div>` : ''}
            ${event.bookedBy ? `<div class="card-meta">Booked by ${event.bookedBy}</div>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  return { render };
})();
