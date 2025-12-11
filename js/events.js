/**
 * Events Core Module
 * Handles event loading, filtering, and state
 * @module events
 */

/// <reference path="./types.d.ts" />

import logger from './logger.js';
import { DEFAULT_EVENTS } from './config.js';
import { loadData, saveData } from './storage.js';
import { showToast } from './utils.js';

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

/** @type {DateEvent[]} */
let allEvents = [];

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize events module
 * @returns {Promise<DateEvent[]>}
 */
export function init() {
    return load();
}

/**
 * Load events from events.json
 * @returns {Promise<DateEvent[]>}
 */
export async function load() {
    try {
        const response = await fetch('events.json');
        if (!response.ok) throw new Error('Failed to load events.json');

        const data = await response.json();
        allEvents = data.events || data;
        logger.success('Events', `Loaded ${allEvents.length} events from events.json`);
    } catch (error) {
        logger.warn('Events', 'Using default events:', error.message);
        allEvents = DEFAULT_EVENTS;
    }

    return allEvents;
}

/**
 * Get all events
 * @returns {DateEvent[]}
 */
export function getAll() {
    return allEvents;
}

// ═══════════════════════════════════════════════════════════════════
// FILTERING
// ═══════════════════════════════════════════════════════════════════

/**
 * Get ratings from storage
 * @returns {Object.<string, {liked?: boolean, disliked?: boolean}>}
 */
export function getRatings() {
    const data = loadData();
    return data.ratings || {};
}

/**
 * Check if event is active (not past and not disliked)
 * @param {DateEvent} event
 * @param {Object.<string, {liked?: boolean, disliked?: boolean}>} ratings
 * @returns {boolean}
 */
function isEventActive(event, ratings) {
    if (ratings[event.id]?.disliked) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : eventDate;

    return endDate >= today;
}

/**
 * Get active events (not past, not disliked)
 * @returns {DateEvent[]}
 */
export function getActive() {
    const ratings = getRatings();
    return allEvents.filter(e => isEventActive(e, ratings));
}

/**
 * Get events by category
 * @param {string} category
 * @returns {DateEvent[]}
 */
export function getByCategory(category) {
    return getActive().filter(e => e.category === category);
}

/**
 * Get favorite events
 * @returns {DateEvent[]}
 */
export function getFavorites() {
    const ratings = getRatings();
    return allEvents.filter(e => ratings[e.id]?.liked);
}

/**
 * Get disliked/excluded events
 * @returns {DateEvent[]}
 */
export function getDisliked() {
    const ratings = getRatings();
    return allEvents.filter(e => ratings[e.id]?.disliked);
}

/**
 * Get upcoming events sorted by date
 * @returns {DateEvent[]}
 */
export function getUpcoming() {
    const today = new Date();
    return allEvents
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Check if event is a "Dauerbrenner" (available on multiple days)
 * @param {DateEvent} event
 * @returns {boolean}
 */
export function isDauerbrenner(event) {
    if (!event.endDate) return false;
    const start = new Date(event.date);
    const end = new Date(event.endDate);
    const diffDays = (end - start) / (1000 * 60 * 60 * 24);
    return diffDays > 7; // More than a week = Dauerbrenner
}

/**
 * Get tagesaktuelle events (specific date, not Dauerbrenner)
 * @returns {DateEvent[]}
 */
export function getTagesaktuelle() {
    return getActive().filter(e => !isDauerbrenner(e));
}

/**
 * Get Dauerbrenner events (available over longer period)
 * @returns {DateEvent[]}
 */
export function getDauerbrenner() {
    return getActive().filter(e => isDauerbrenner(e));
}

/**
 * Find event by ID
 * @param {string} id
 * @returns {DateEvent|undefined}
 */
export function findById(id) {
    return allEvents.find(e => e.id === id);
}

/**
 * Get random active event
 * @param {string|null} [category=null]
 * @returns {DateEvent|null}
 */
export function getRandom(category = null) {
    let eligible = getActive();

    if (category && category !== 'all') {
        eligible = eligible.filter(e => e.category === category);
    }

    if (eligible.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * eligible.length);
    return eligible[randomIndex];
}

// ═══════════════════════════════════════════════════════════════════
// RATING SYSTEM
// ═══════════════════════════════════════════════════════════════════

// Import render function lazily to avoid circular dependency
let renderFn = null;

export function setRenderFunction(fn) {
    renderFn = fn;
}

/**
 * Rate an event (like/dislike)
 * @param {string} eventId
 * @param {'like'|'dislike'} type
 */
export function rate(eventId, type) {
    const data = loadData();
    if (!data.ratings) data.ratings = {};

    if (type === 'like') {
        data.ratings[eventId] = { liked: !data.ratings[eventId]?.liked, disliked: false };
        showToast(data.ratings[eventId].liked ? '❤️ Favorit gespeichert!' : '💔 Favorit entfernt');
    } else {
        data.ratings[eventId] = { liked: false, disliked: !data.ratings[eventId]?.disliked };
        showToast(data.ratings[eventId].disliked ? '👎 Ausgeblendet' : '👍 Wiederhergestellt');
    }

    saveData(data);
    if (renderFn) renderFn();
}

/**
 * Restore a disliked event
 * @param {string} eventId
 */
export function restore(eventId) {
    const data = loadData();
    if (data.ratings && data.ratings[eventId]) {
        data.ratings[eventId].disliked = false;
        saveData(data);
        if (renderFn) renderFn();
        showToast('✅ Event wiederhergestellt!');
    }
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL HANDLERS
// ═══════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
    window.rateEvent = rate;
    window.restoreEvent = restore;
}
