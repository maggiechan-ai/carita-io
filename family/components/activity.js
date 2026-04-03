/* ========================================
   Activity Feed — activity.js
   ======================================== */

const ActivitySection = (() => {

  // Custom SVG icons
  const checkIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  function formatTimestamp(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const time = date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (date.toDateString() === now.toDateString()) return `Today, ${time}`;
    if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${time}`;
  }

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  function render(entries) {
    const container = document.getElementById('activity-list');

    if (!entries || entries.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M8 12h32M8 24h24M8 36h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <p class="empty-state-text">No activity yet. Updates from Carita and your family will show here.</p>
        </div>`;
      return;
    }

    container.innerHTML = entries.map((entry, i) => {
      const isSystem = entry.author === 'Carita';
      const avatarClass = isSystem ? 'carita' : 'user';
      const initials = isSystem ? 'C' : getInitials(entry.author);
      const itemClass = isSystem ? 'activity-item system' : 'activity-item';

      let content = entry.content;
      if (isSystem && entry.isAction) {
        content = `<span class="system-action">${checkIcon} ${content}</span>`;
      } else if (!isSystem) {
        content = `"${content}"`;
      }

      return `
        <div class="${itemClass} card-animate" style="animation-delay: ${i * 50}ms">
          <div class="activity-avatar ${avatarClass}">${initials}</div>
          <div class="activity-body">
            <div class="activity-header">
              <span class="activity-author">${entry.author}</span>
              <span class="activity-time">${formatTimestamp(entry.timestamp)}</span>
            </div>
            <div class="activity-content">${content}</div>
          </div>
        </div>`;
    }).join('');
  }

  return { render };
})();
