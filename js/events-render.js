/**
 * Events Rendering Module
 * Handles rendering event cards and lists
 */

import { getActive, getFavorites, getDisliked, findById, getTagesaktuelle, getDauerbrenner, isDauerbrenner } from './events.js';
import { loadData } from './storage.js';

/**
 * Get ratings from storage
 */
function getRatings() {
    const data = loadData();
    return data.ratings || {};
}

/**
 * Format date for display
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
 * Calculate days until date
 */
function daysUntil(dateStr) {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
}

/**
 * Get bar name(s) from bar object
 */
function getBarNames(bar) {
    if (!bar) return '';
    return Array.isArray(bar) ? bar.map(b => b.name).join(', ') : bar.name;
}

/**
 * Render all events to containers
 */
export function render() {
    const ratings = getRatings();
    const tagesaktuelle = getTagesaktuelle();
    const dauerbrenner = getDauerbrenner();
    const categories = ['wellness', 'aktiv', 'handwerk', 'comedy', 'essen', 'musik', 'shows'];

    // Tagesaktuelle events container (Highlights)
    const tagesaktuelleContainer = document.getElementById('tagesaktuelleEvents');
    if (tagesaktuelleContainer) {
        tagesaktuelleContainer.innerHTML = tagesaktuelle.length > 0
            ? tagesaktuelle.sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => createCard(e, ratings)).join('')
            : '<p style="text-align:center;color:var(--text-muted);padding:40px;">Keine tagesaktuellen Events - schaut bei den Dauerbrennern!</p>';
    }

    // Dauerbrenner events container
    const dauerbrennerContainer = document.getElementById('dauerbrennerEvents');
    if (dauerbrennerContainer) {
        dauerbrennerContainer.innerHTML = dauerbrenner.length > 0
            ? dauerbrenner.map(e => createCard(e, ratings)).join('')
            : '<p style="text-align:center;color:var(--text-muted);padding:40px;">Keine Dauerbrenner verfügbar</p>';
    }

    // Legacy: All events container (fallback)
    const eventsContainer = document.getElementById('eventsContainer');
    if (eventsContainer) {
        const active = getActive();
        eventsContainer.innerHTML = active.map(e => createCard(e, ratings)).join('');
    }

    // Category-specific containers
    categories.forEach(cat => {
        const container = document.getElementById(`${cat}Events`);
        if (container) {
            const active = getActive();
            const catEvents = active.filter(e => e.category === cat);
            const catTagesaktuelle = catEvents.filter(e => !isDauerbrenner(e));
            const catDauerbrenner = catEvents.filter(e => isDauerbrenner(e));

            let html = '';
            if (catTagesaktuelle.length > 0) {
                html += `<div class="events-section"><h3 class="events-section-title">✨ Highlights</h3><div class="events-grid-inner">${catTagesaktuelle.sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => createCard(e, ratings)).join('')}</div></div>`;
            }
            if (catDauerbrenner.length > 0) {
                html += `<div class="events-section"><h3 class="events-section-title">🔥 Dauerbrenner</h3><div class="events-grid-inner">${catDauerbrenner.map(e => createCard(e, ratings)).join('')}</div></div>`;
            }
            container.innerHTML = html || '<p style="text-align:center;color:var(--text-muted);padding:40px;">Keine Events in dieser Kategorie</p>';
        }
    });

    // Favorites container
    const favContainer = document.getElementById('favoritesContainer');
    if (favContainer) {
        const favorites = getFavorites();
        favContainer.innerHTML = favorites.length > 0
            ? favorites.map(e => createCard(e, ratings)).join('')
            : '<p style="text-align:center;color:var(--text-muted);padding:40px;">Noch keine Favoriten - liked eure Lieblings-Dates!</p>';
    }

    // Nope/excluded container
    const nopeContainer = document.getElementById('nopeContainer');
    if (nopeContainer) {
        const nope = getDisliked();
        nopeContainer.innerHTML = nope.length > 0
            ? nope.map(e => `
                <div style="padding:var(--space-md);background:var(--bg-card);border-radius:var(--radius-md);display:flex;justify-content:space-between;align-items:center;">
                    <span>${e.emoji} ${e.title}</span>
                    <button class="btn btn-secondary" onclick="restoreEvent('${e.id}')">Wiederherstellen</button>
                </div>
            `).join('')
            : '<p style="text-align:center;color:var(--text-muted);padding:40px;">Keine ausgeblendeten Events</p>';
    }
}

/**
 * Create event card HTML
 */
export function createCard(event, ratings) {
    const isLiked = ratings[event.id]?.liked;
    const isDisliked = ratings[event.id]?.disliked;
    const days = daysUntil(event.date);
    const today = new Date();
    const eventDate = new Date(event.date);
    const isPast = eventDate < today && !event.endDate;

    // Countdown badge
    let countdownBadge = '';
    if (days === 0) {
        countdownBadge = '<span class="date-badge badge-countdown">Heute!</span>';
    } else if (days > 0 && days <= 7) {
        countdownBadge = `<span class="date-badge badge-countdown">In ${days} Tag${days > 1 ? 'en' : ''}</span>`;
    }

    return `
        <div class="date-card ${isPast ? 'past-event' : ''}" data-event-id="${event.id}">
            <div class="date-card-header">
                <div class="date-emoji">${event.emoji}</div>
                <div class="date-info">
                    <h3 class="date-title">${event.title}</h3>
                    <div class="date-meta">
                        <span>📅 ${formatDate(event.date)}${event.endDate ? ' - ' + formatDate(event.endDate) : ''}</span>
                        ${event.time ? `<span>🕐 ${event.time}</span>` : ''}
                        ${event.price ? `<span>💰 ${event.price}</span>` : ''}
                    </div>
                </div>
                <div class="date-badges">
                    ${countdownBadge}
                    ${event.price && event.price.toLowerCase().includes('frei') ? '<span class="date-badge badge-free">Gratis</span>' : ''}
                </div>
            </div>
            <div class="date-card-body">
                ${event.description ? `<p class="date-description">${event.description}</p>` : ''}
                <div class="venue-grid">
                    ${event.restaurant ? `
                        <div class="venue-card">
                            <div class="venue-card-header">
                                <span class="venue-icon">🍽️</span>
                                <span class="venue-label">Restaurant</span>
                            </div>
                            <div class="venue-name">${event.restaurant.name}</div>
                            <div class="venue-type">${event.restaurant.type || ''}</div>
                            ${event.restaurant.empfehlung ? `<div class="venue-recommendation">💡 ${event.restaurant.empfehlung}</div>` : ''}
                            ${event.restaurant.link ? `<a href="${event.restaurant.link}" target="_blank" class="venue-link">Zur Website →</a>` : ''}
                        </div>
                    ` : ''}
                    ${event.bar ? `
                        <div class="venue-card">
                            <div class="venue-card-header">
                                <span class="venue-icon">🍸</span>
                                <span class="venue-label">Bar</span>
                            </div>
                            <div class="venue-name">${getBarNames(event.bar)}</div>
                            <div class="venue-type">${Array.isArray(event.bar) ? event.bar[0].type : event.bar.type}</div>
                        </div>
                    ` : ''}
                </div>
                <div class="card-actions">
                    ${event.link ? `<a href="${event.link}" target="_blank" class="btn btn-primary">🎟️ Tickets/Info</a>` : ''}
                    ${event.address ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}" target="_blank" class="btn btn-secondary">📍 Karte</a>` : ''}
                    <div class="thumbs-rating">
                        <button class="thumb-btn thumb-up ${isLiked ? 'selected' : ''}" onclick="rateEvent('${event.id}', 'like')">👍</button>
                        <button class="thumb-btn thumb-down ${isDisliked ? 'selected' : ''}" onclick="rateEvent('${event.id}', 'dislike')">👎</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
