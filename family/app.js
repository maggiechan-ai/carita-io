/* ========================================
   Carita Family Dashboard — app.js
   Mock data + initialization
   ======================================== */

const App = (() => {

  // --- Supabase Config ---
  const SUPABASE_URL = 'https://czfzbmcduafcxxrpdkvt.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZnpibWNkdWFmY3h4cnBka3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MjE1MjIsImV4cCI6MjA5MDQ5NzUyMn0.tveJ7h-Jb-Dv0j1PVPbKd5hlqnn9BvaTrD2URIuTw6I';

  // Extract family code from URL
  function getFamilyCode() {
    const path = window.location.pathname;
    const match = path.match(/\/family\/([^/]+)/);
    return match ? match[1] : 'mchen-a7f3'; // fallback to mock
  }

  // --- Mock Data: Margaret Chen ---
  const mockData = {
    familyName: "Chen Family",
    parentName: "Margaret Chen",

    calendar: [
      {
        date: getRelativeDate(2),
        time: '14:00',
        title: 'Dr. Priya Patel (GP checkup)',
        subtitle: 'Westmead Medical, 18 Station St',
        type: 'appointment',
        bookedBy: 'Sarah'
      },
      {
        date: getRelativeDate(3),
        time: '10:00',
        title: 'Maria (cleaner)',
        subtitle: 'Regular weekly visit',
        type: 'service',
        bookedBy: null
      },
      {
        date: getRelativeDate(7),
        time: null,
        title: 'Amlodipine refill due',
        subtitle: 'Chemist Warehouse, Westmead',
        type: 'medication',
        bookedBy: null
      },
      {
        date: getRelativeDate(10),
        time: '09:00',
        title: 'Pete, GreenThumb (gardener)',
        subtitle: 'Fortnightly visit',
        type: 'garden',
        bookedBy: null
      },
      {
        date: getRelativeDate(12),
        time: '10:00',
        title: 'Woolworths delivery',
        subtitle: 'Regular weekly groceries',
        type: 'grocery',
        bookedBy: null
      }
    ],

    activity: [
      {
        author: 'Sarah',
        timestamp: getRelativeTimestamp(0, 15, 15),
        content: 'Mum seemed tired today, didn\'t eat much lunch',
        isAction: false
      },
      {
        author: 'Carita',
        timestamp: getRelativeTimestamp(1, 11, 0),
        content: 'Dr. Patel appointment booked (Thu, 2 PM)',
        isAction: true
      },
      {
        author: 'James',
        timestamp: getRelativeTimestamp(2, 14, 30),
        content: 'Called Mum, she sounded good. Talked about the garden.',
        isAction: false
      },
      {
        author: 'Carita',
        timestamp: getRelativeTimestamp(3, 16, 0),
        content: 'Woolworths grocery delivery completed',
        isAction: true
      },
      {
        author: 'Sarah',
        timestamp: getRelativeTimestamp(4, 9, 30),
        content: 'Mum really enjoyed her morning tea with Mary yesterday. Was in great spirits.',
        isAction: false
      },
      {
        author: 'Carita',
        timestamp: getRelativeTimestamp(5, 18, 0),
        content: 'Weekly digest sent to all family members',
        isAction: true
      },
      {
        author: 'James',
        timestamp: getRelativeTimestamp(6, 11, 15),
        content: 'Dropped off some biscuits for Mum. She mentioned her knee was sore again.',
        isAction: false
      }
    ],

    profile: [
      {
        key: 'about',
        title: 'About',
        type: 'fields',
        canAdd: false,
        fields: [
          { key: 'age', label: 'Age', value: '82' },
          { key: 'address', label: 'Address', value: '42 Elm Street, Westmead NSW 2145' },
          { key: 'living', label: 'Living situation', value: 'Alone' },
          { key: 'emergency', label: 'Emergency', value: 'Sarah Chen, 0412 345 678' }
        ]
      },
      {
        key: 'medications',
        title: 'Medications & Allergies',
        type: 'list',
        canAdd: true,
        items: [
          { id: 'med1', primary: 'Amlodipine 5mg', secondary: 'Every morning' },
          { id: 'med2', primary: 'Metformin 500mg', secondary: 'Morning & evening' },
          { id: 'med3', primary: 'Paracetamol', secondary: 'As needed (knee pain)' }
        ],
        allergies: ['Penicillin']
      },
      {
        key: 'healthcare',
        title: 'Healthcare Providers',
        type: 'list',
        canAdd: true,
        items: [
          { id: 'hc1', primary: 'GP: Dr. Priya Patel', secondary: 'Westmead Medical — preferred time: mornings' },
          { id: 'hc2', primary: 'Geriatrician: Dr. Liu', secondary: 'Parramatta Specialist Centre — next visit: May 15' },
          { id: 'hc3', primary: 'Pharmacy: Chemist Warehouse', secondary: 'Westmead' },
          { id: 'hc4', primary: 'Physio: ActiveCare Westmead', secondary: 'Wednesdays' }
        ]
      },
      {
        key: 'home',
        title: 'Home & Services',
        type: 'list',
        canAdd: true,
        items: [
          { id: 'svc1', primary: 'Gardener: Pete, GreenThumb', secondary: 'Every 2nd Thursday' },
          { id: 'svc2', primary: 'Cleaner: Maria', secondary: 'Mondays 10 AM' },
          { id: 'svc3', primary: 'Groceries: Woolworths delivery', secondary: 'Fridays' },
          { id: 'svc4', primary: 'Handyman: Reliable Tony', secondary: 'Used for bathroom rail' }
        ]
      },
      {
        key: 'transport',
        title: 'Transport',
        type: 'bullets',
        canAdd: false,
        items: [
          'Can\'t drive',
          'Uber with assistance (knows the app)',
          'Medical transport for hospital visits',
          'Buzzer code: #42A'
        ]
      },
      {
        key: 'food',
        title: 'Food & Preferences',
        type: 'bullets',
        canAdd: false,
        items: [
          'Loves: fish & chips, tea with milk, biscuits',
          'Avoids: spicy food, anything too chewy',
          'Favourite restaurant: The Admiral, Station St',
          'Favourite cafe: Bean & Leaf (for morning tea with Mary)'
        ]
      },
      {
        key: 'routine',
        title: 'Routine & Scheduling',
        type: 'bullets',
        canAdd: false,
        items: [
          'Prefers morning appointments (before 11 AM)',
          'Gets anxious in evenings — avoid scheduling then',
          'Neighbour Mary checks in Tuesdays',
          'Watches TV at 7 PM (don\'t call then)',
          'Naps after lunch (1–2:30 PM)'
        ]
      },
      {
        key: 'people',
        title: 'People in Margaret\'s Life',
        type: 'people',
        canAdd: true,
        items: [
          { name: 'Mary', role: 'neighbour', detail: 'Checks in Tuesdays, has spare key' },
          { name: 'Pete', role: 'gardener', detail: 'Margaret enjoys chatting with him' },
          { name: 'Dr. Patel', role: 'GP', detail: 'Margaret trusts her, been her GP 12 years' }
        ]
      }
    ]
  };

  // --- Helpers ---
  function getRelativeDate(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  }

  function getRelativeTimestamp(daysAgo, hours, minutes) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  }

  // --- Toast ---
  function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  // --- Tab Navigation ---
  function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab button
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show corresponding content
        const tabName = tab.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(5);
      });
    });
  }

  // --- Initialize ---
  function init() {
    const familyCode = getFamilyCode();

    // Simulate loading delay for skeleton effect
    setTimeout(() => {
      // Update header
      document.getElementById('header-family-name').textContent = mockData.familyName;

      // Update profile title
      document.getElementById('profile-title').textContent = `${mockData.parentName} — Care Profile`;

      // Render all sections
      CalendarSection.render(mockData.calendar);
      ActivitySection.render(mockData.activity);
      ProfileSection.render(mockData.profile);
    }, 400);

    // Init tab navigation
    initTabs();
  }

  // Start
  document.addEventListener('DOMContentLoaded', init);

  return { showToast, getFamilyCode };
})();
