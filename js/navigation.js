/**
 * Navigation Module
 * Handles category switching, search, and UI navigation
 * - Nav tabs with active state
 * - Global search with results
 * - Feierabend time filter
 * - Section visibility
 */

import { showToast } from './utils.js';

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const FEIERABEND_CATEGORIES = ['handwerk', 'aktiv', 'wellness', 'comedy', 'essen', 'shows', 'all'];
const SEARCH_MIN_LENGTH = 2;
const SEARCH_MAX_RESULTS = 8;
const TRAVEL_COMMUTE_MINUTES = 45;

// State
let currentCategory = 'all';
let allEvents = [];

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize navigation module
 * @param {Array} events - All events array
 */
export function init(events = []) {
    allEvents = events;
    setupSearchListener();
    setupClickOutside();
}

/**
 * Set events (can be called after events load)
 * @param {Array} events - Events array
 */
export function setEvents(events) {
    allEvents = events;
}

// ═══════════════════════════════════════════════════════════════════
// CATEGORY NAVIGATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Show a category section
 * @param {string} category - Category name
 */
export function show(category) {
    currentCategory = category;

    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });

    // Show/hide sections
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('active');
    });

    const section = document.getElementById(`section-${category}`);
    if (section) {
        section.classList.add('active');
    }

    // Toggle feierabend filter visibility
    const feierabendToggle = document.getElementById('feierabendToggle');
    if (feierabendToggle) {
        feierabendToggle.style.display =
            FEIERABEND_CATEGORIES.includes(category) ? 'flex' : 'none';
    }

    // Lazy-init for special sections
    if (category === 'travel') {
        setTimeout(() => {
            if (typeof window.Globe !== 'undefined') {
                window.Globe.init();
            }
        }, 100);
    }

    if (category === 'builder') {
        setTimeout(() => {
            if (typeof window.DateBuilder !== 'undefined') {
                window.DateBuilder.initMap();
            }
        }, 100);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Get current category
 * @returns {string}
 */
export function getCurrentCategory() {
    return currentCategory;
}

// ═══════════════════════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════════════════════

/**
 * Setup search input listener
 */
function setupSearchListener() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            search(e.target.value);
        });
    }
}

/**
 * Setup click outside to close search
 */
function setupClickOutside() {
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-container')) {
            const results = document.getElementById('searchResults');
            if (results) results.classList.remove('active');
        }
    });
}

/**
 * Perform search
 * @param {string} query - Search query
 */
export function search(query) {
    const results = document.getElementById('searchResults');
    if (!results) return;

    if (query.length < SEARCH_MIN_LENGTH) {
        results.classList.remove('active');
        return;
    }

    const q = query.toLowerCase();
    const matches = allEvents.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q))
    ).slice(0, SEARCH_MAX_RESULTS);

    if (matches.length === 0) {
        results.innerHTML = '<div class="search-result-item" style="color:var(--text-muted)">Keine Ergebnisse</div>';
    } else {
        results.innerHTML = matches.map(e => `
            <div class="search-result-item" onclick="goToEvent('${e.category}', '${e.id}')">
                <div><span>${e.emoji}</span> <strong>${e.title}</strong></div>
                <div style="font-size:0.8rem;color:var(--text-muted)">${formatDate(e.date)}</div>
            </div>
        `).join('');
    }

    results.classList.add('active');
}

/**
 * Format date for display
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
}

/**
 * Navigate to a specific event
 * @param {string} category - Event category
 * @param {string} eventId - Event ID
 */
export function goToEvent(category, eventId) {
    // Close search
    const results = document.getElementById('searchResults');
    const input = document.getElementById('globalSearch');
    if (results) results.classList.remove('active');
    if (input) input.value = '';

    // Navigate to category
    show(category);

    // Scroll to event card
    setTimeout(() => {
        const card = document.querySelector(`[data-event-id="${eventId}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
}

// ═══════════════════════════════════════════════════════════════════
// FEIERABEND FILTER
// ═══════════════════════════════════════════════════════════════════

/**
 * Filter events by feierabend time
 */
export function filterByFeierabend() {
    const timeInput = document.getElementById('feierabendTime');
    if (!timeInput) return;

    const time = timeInput.value;

    if (!time) {
        // Reset filter
        document.querySelectorAll('.date-card').forEach(card => {
            card.classList.remove('excluded');
        });
        return;
    }

    const feierabendMins = timeToMinutes(time);

    document.querySelectorAll('.date-card').forEach(card => {
        const eventId = card.dataset.eventId;
        const event = allEvents.find(e => e.id === eventId);

        if (!event?.time) {
            card.classList.remove('excluded');
            return;
        }

        const eventMins = timeToMinutes(event.time);
        if (eventMins === null) {
            card.classList.remove('excluded');
            return;
        }

        // Exclude if event starts before feierabend + commute time
        card.classList.toggle('excluded', eventMins < feierabendMins + TRAVEL_COMMUTE_MINUTES);
    });
}

/**
 * Parse time string to minutes
 * @param {string} timeStr - Time string (e.g., "17:30")
 * @returns {number|null}
 */
function timeToMinutes(timeStr) {
    if (!timeStr) return null;
    const match = timeStr.match(/(\d{1,2}):?(\d{2})?/);
    if (!match) return null;
    return parseInt(match[1]) * 60 + parseInt(match[2] || 0);
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL HANDLERS
// ═══════════════════════════════════════════════════════════════════

// Make handlers available globally for HTML onclick
if (typeof window !== 'undefined') {
    window.showCategory = show;
    window.handleSearch = search;
    window.goToEvent = goToEvent;
    window.filterByFeierabend = filterByFeierabend;
}
