/**
 * Roulette Module
 * Random date selection with spinning animation
 * - Open modal with spin
 * - Pick random active event
 * - Display with details
 */

import { getActive, findById } from './events.js';
import { showToast, formatDate, getBarName } from './utils.js';

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

let currentResult = null;

// ═══════════════════════════════════════════════════════════════════
// MODAL CONTROL
// ═══════════════════════════════════════════════════════════════════

/**
 * Open roulette modal and start spinning
 */
export function open() {
    const modal = document.getElementById('rouletteModal');
    if (modal) {
        modal.classList.add('active');
        spin();
    }
}

/**
 * Close roulette modal
 */
export function close() {
    const modal = document.getElementById('rouletteModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ═══════════════════════════════════════════════════════════════════
// SPINNING LOGIC
// ═══════════════════════════════════════════════════════════════════

/**
 * Spin the roulette and select random event
 */
export function spin() {
    const emoji = document.getElementById('rouletteEmoji');
    const title = document.getElementById('rouletteTitle');
    const details = document.getElementById('rouletteDetails');

    if (!emoji || !title || !details) return;

    // Start spinning animation
    emoji.classList.add('spinning');

    const available = getActive();

    if (available.length === 0) {
        setTimeout(() => {
            emoji.classList.remove('spinning');
            emoji.textContent = '😢';
            title.textContent = 'Keine Events verfügbar';
            details.innerHTML = '';
            currentResult = null;
        }, 500);
        return;
    }

    // Select random event
    const random = available[Math.floor(Math.random() * available.length)];
    currentResult = random;

    // Reveal after spin animation
    setTimeout(() => {
        emoji.classList.remove('spinning');
        emoji.textContent = random.emoji;
        title.textContent = random.title;

        let detailsHtml = `
            <p style="color:var(--text-secondary);margin-bottom:var(--space-md);">
                📅 ${formatDate(random.date)} ${random.time ? '• ' + random.time : ''}
            </p>
        `;

        if (random.restaurant) {
            detailsHtml += `<p>🍽️ ${random.restaurant.name}</p>`;
        }

        if (random.bar) {
            detailsHtml += `<p>🍸 ${getBarName(random.bar)}</p>`;
        }

        details.innerHTML = detailsHtml;
    }, 500);
}

/**
 * Get the current roulette result
 * @returns {Object|null}
 */
export function getResult() {
    return currentResult;
}

/**
 * Accept the current result and navigate to it
 */
export function accept() {
    if (!currentResult) return;

    close();

    // Navigate to the event in the event list
    setTimeout(() => {
        const card = document.querySelector(`[data-event-id="${currentResult.id}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Brief highlight
            card.style.animation = 'pulse 0.5s ease';
        }
    }, 300);

    showToast(`🎰 ${currentResult.emoji} ${currentResult.title} ausgewählt!`);
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL HANDLERS
// ═══════════════════════════════════════════════════════════════════

// Make handlers available globally for HTML onclick
if (typeof window !== 'undefined') {
    window.openRoulette = open;
    window.spinRoulette = spin;
    window.closeRoulette = close;
    window.acceptRoulette = accept;
}
