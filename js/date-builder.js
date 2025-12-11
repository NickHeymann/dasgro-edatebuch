/**
 * Date Builder Core Module
 * Plan complete dates with activity + food + drinks
 * - State management
 * - Category/event selection
 * - Food/drinks options
 * @module date-builder
 */

/// <reference path="./types.d.ts" />

import { CATEGORIES } from './config.js';
import { getByCategory, findById } from './events.js';
import { showToast, formatDate, getBarName, getCategoryEmoji } from './utils.js';

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

/**
 * @type {{
 *   category: string|null,
 *   event: DateEvent|null,
 *   food: 'vorher'|'nachher'|'nein'|null,
 *   drinks: 'ja'|'nein'|null
 * }}
 */
let plan = {
    category: null,
    event: null,
    food: null,
    drinks: null
};

// Callbacks for UI updates (set by date-builder-ui.js)
let onPlanChange = null;

/**
 * Get current plan state
 * @returns {DatePlan}
 */
export function getPlan() {
    return { ...plan };
}

/**
 * Set callback for plan changes
 */
export function setOnPlanChange(callback) {
    onPlanChange = callback;
}

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize date builder module
 */
export function init() {
    renderCategories();
}

/**
 * Render category selection pills
 */
function renderCategories() {
    const container = document.getElementById('builderCategories');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => `
        <button class="category-pill" onclick="selectBuilderCategory('${cat}')">
            ${getCategoryEmoji(cat)} ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
    `).join('');
}

/**
 * Render events for selected category
 */
function renderEvents() {
    const container = document.getElementById('builderEvents');
    if (!container || !plan.category) return;

    const events = getByCategory(plan.category);

    if (events.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">Keine Events in dieser Kategorie</p>';
        return;
    }

    container.innerHTML = events.map(e => `
        <div class="event-select-card" data-event-id="${e.id}" onclick="selectBuilderEvent('${e.id}')">
            <div style="font-size:1.5rem;margin-bottom:var(--space-xs)">${e.emoji}</div>
            <div style="font-weight:600">${e.title}</div>
            <div style="font-size:0.85rem;color:var(--text-muted)">${formatDate(e.date)}</div>
        </div>
    `).join('');
}

// ═══════════════════════════════════════════════════════════════════
// SELECTION HANDLERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Select a category
 * @param {string} category
 */
export function selectCategory(category) {
    plan.category = category;
    plan.event = null;
    plan.food = null;
    plan.drinks = null;

    // Update category pills
    document.querySelectorAll('#builderCategories .category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.textContent.toLowerCase().includes(category));
    });

    renderEvents();
    if (onPlanChange) onPlanChange('category');
}

/**
 * Select an event
 * @param {string} eventId
 */
export function selectEvent(eventId) {
    plan.event = findById(eventId);

    // Update event card selection
    document.querySelectorAll('.event-select-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.eventId === eventId);
    });

    if (onPlanChange) onPlanChange('event');
}

/**
 * Set food option
 * @param {'vorher'|'nachher'|'nein'} option
 */
export function setFood(option) {
    plan.food = option;

    document.querySelectorAll('[name="food-option"]').forEach(btn => {
        btn.classList.toggle('selected', btn.value === option);
    });

    if (onPlanChange) onPlanChange('food');
}

/**
 * Set drinks option
 * @param {'ja'|'nein'} option
 */
export function setDrinks(option) {
    plan.drinks = option;

    document.querySelectorAll('[name="drinks-option"]').forEach(btn => {
        btn.classList.toggle('selected', btn.value === option);
    });

    if (onPlanChange) onPlanChange('drinks');
}

/**
 * Reset the date builder
 */
export function reset() {
    plan = { category: null, event: null, food: null, drinks: null };

    document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.event-select-card').forEach(c => c.classList.remove('selected'));

    const eventsContainer = document.getElementById('builderEvents');
    if (eventsContainer) eventsContainer.innerHTML = '';

    if (onPlanChange) onPlanChange('reset');
    showToast('🔄 Zurückgesetzt');
}

// ═══════════════════════════════════════════════════════════════════
// SUMMARY RENDERING
// ═══════════════════════════════════════════════════════════════════

/**
 * Update the date summary display
 */
export function updateSummary() {
    if (!plan.event) return;

    const summary = document.getElementById('dateSummary');
    const content = document.getElementById('summaryContent');
    if (!summary || !content) return;

    const e = plan.event;
    let html = '';
    let stepNum = 1;

    // Food before
    if (plan.food === 'vorher' && e.restaurant) {
        html += `<div class="summary-item"><span>${stepNum}️⃣</span><span>🍽️ ${e.restaurant.name}</span></div>`;
        stepNum++;
    }

    // Main activity
    html += `<div class="summary-item"><span>${stepNum}️⃣</span><span>${e.emoji} ${e.title}</span></div>`;
    stepNum++;

    // Food after
    if (plan.food === 'nachher' && e.restaurant) {
        html += `<div class="summary-item"><span>${stepNum}️⃣</span><span>🍽️ ${e.restaurant.name}</span></div>`;
        stepNum++;
    }

    // Drinks
    if (plan.drinks === 'ja' && e.bar) {
        html += `<div class="summary-item"><span>🍸</span><span>${getBarName(e.bar)}</span></div>`;
    }

    content.innerHTML = html;
    summary.style.display = 'block';
}

/**
 * Hide the summary
 */
export function hideSummary() {
    const summary = document.getElementById('dateSummary');
    if (summary) summary.style.display = 'none';
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL HANDLERS
// ═══════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
    window.selectBuilderCategory = selectCategory;
    window.selectBuilderEvent = selectEvent;
    window.setFoodOption = setFood;
    window.setDrinksOption = setDrinks;
    window.resetDateBuilder = reset;
}
