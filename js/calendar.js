/**
 * Calendar Module
 * Mini calendar with event indicators
 * - Month navigation
 * - Event day highlighting
 * - Next event widget
 */

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

// State
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let allEvents = [];

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize calendar with events
 * @param {Array} events - All events array
 */
export function init(events = []) {
    allEvents = events;
    render();
}

/**
 * Set events (can be called after events load)
 * @param {Array} events - Events array
 */
export function setEvents(events) {
    allEvents = events;
    render();
}

// ═══════════════════════════════════════════════════════════════════
// CALENDAR TOGGLE
// ═══════════════════════════════════════════════════════════════════

/**
 * Toggle calendar visibility
 */
export function toggle() {
    const cal = document.getElementById('miniCalendar');
    if (cal) {
        cal.style.display = cal.style.display === 'none' ? 'block' : 'none';
    }
}

// ═══════════════════════════════════════════════════════════════════
// MONTH NAVIGATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Change displayed month
 * @param {number} delta - Number of months to change (+1 or -1)
 */
export function changeMonth(delta) {
    currentMonth += delta;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    render();
}

// ═══════════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════════

/**
 * Render calendar grid
 */
export function render() {
    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('calendarTitle');

    if (!grid || !title) return;

    // Update title
    title.textContent = `${MONTHS[currentMonth]} ${currentYear}`;

    // Calculate first and last day
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7; // Monday = 0

    const today = new Date();

    // Find days with events in this month
    const eventDays = new Set();
    allEvents.forEach(e => {
        const d = new Date(e.date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            eventDays.add(d.getDate());
        }
    });

    // Build HTML
    let html = WEEKDAYS.map(d =>
        `<div class="mini-calendar-day header">${d}</div>`
    ).join('');

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
        html += '<div class="mini-calendar-day other-month"></div>';
    }

    // Days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const isToday = day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
        const hasEvent = eventDays.has(day);

        html += `<div class="mini-calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}"
                     onclick="showEventsForDay(${day})">${day}</div>`;
    }

    grid.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════
// EVENT HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get events for a specific date
 * @param {number} day - Day of month
 * @returns {Array} Events on that day
 */
export function getEventsForDay(day) {
    const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return allEvents.filter(e => e.date === dateStr);
}

/**
 * Calculate days until a date
 * @param {string} dateStr - ISO date string
 * @returns {number} Days until date
 */
function daysUntil(dateStr) {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
}

/**
 * Update next event widget in header
 */
export function updateNextEventWidget() {
    const widget = document.getElementById('nextEventWidget');
    if (!widget) return;

    const today = new Date();
    const upcoming = allEvents
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcoming.length > 0) {
        const next = upcoming[0];
        const days = daysUntil(next.date);

        if (days === 0) {
            widget.textContent = `Heute: ${next.emoji} ${next.title}`;
        } else if (days === 1) {
            widget.textContent = `Morgen: ${next.emoji} ${next.title}`;
        } else {
            widget.textContent = `In ${days} Tagen: ${next.emoji}`;
        }
    } else {
        widget.textContent = 'Keine Events geplant';
    }
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL HANDLERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Show events for specific day (called from calendar click)
 * @param {number} day - Day of month
 */
function showEventsForDay(day) {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = allEvents.filter(e => e.date === dateStr);

    if (dayEvents.length > 0) {
        // Navigate to "all" section and scroll to event
        if (typeof window.showCategory === 'function') {
            window.showCategory('all');
        }

        setTimeout(() => {
            const card = document.querySelector(`[data-event-id="${dayEvents[0].id}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    }
}

// Make handlers available globally for HTML onclick
if (typeof window !== 'undefined') {
    window.toggleMiniCalendar = toggle;
    window.changeCalendarMonth = changeMonth;
    window.showEventsForDay = showEventsForDay;
}
