/**
 * Storage Module
 * Handles all localStorage operations
 * - Load and save app data
 * - Ratings, favorites, exclusions
 * - Memory captions
 * - OSM venue caching
 */

import logger from './logger.js';
import { STORAGE_KEY, OSM_CACHE_KEY, OSM_CACHE_DURATION } from './config.js';

// OSM venue data cache
export let osmVenueData = { restaurants: [], bars: [], lastFetch: 0 };

/**
 * Load all data from localStorage
 * @returns {Object} Parsed data object
 */
export function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return {
            ratings: {},
            favorites: [],
            excluded: [],
            memoryCaptions: {},
            hasSeenIntro: false
        };
    }

    try {
        return JSON.parse(saved);
    } catch (e) {
        logger.error('Storage', 'Error parsing localStorage data:', e);
        return {
            ratings: {},
            favorites: [],
            excluded: [],
            memoryCaptions: {},
            hasSeenIntro: false
        };
    }
}

/**
 * Save data to localStorage
 * @param {Object} data - Data object to save
 */
export function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        logger.error('Storage', 'Error saving to localStorage:', e);
    }
}

/**
 * Get rating for a specific event
 * @param {string} eventId - Event ID
 * @returns {string|null} Rating ('up' or 'down') or null
 */
export function getRating(eventId) {
    const data = loadData();
    return data.ratings?.[eventId] || null;
}

/**
 * Set rating for an event
 * @param {string} eventId - Event ID
 * @param {string} rating - 'up' or 'down'
 */
export function setRating(eventId, rating) {
    const data = loadData();
    if (!data.ratings) data.ratings = {};
    data.ratings[eventId] = rating;
    saveData(data);
}

/**
 * Check if event is in favorites
 * @param {string} eventId - Event ID
 * @returns {boolean}
 */
export function isFavorite(eventId) {
    const data = loadData();
    return data.favorites?.includes(eventId) || false;
}

/**
 * Toggle favorite status for an event
 * @param {string} eventId - Event ID
 * @returns {boolean} New favorite status
 */
export function toggleFavorite(eventId) {
    const data = loadData();
    if (!data.favorites) data.favorites = [];

    const index = data.favorites.indexOf(eventId);
    if (index > -1) {
        data.favorites.splice(index, 1);
    } else {
        data.favorites.push(eventId);
    }

    saveData(data);
    return data.favorites.includes(eventId);
}

/**
 * Check if event is excluded (nope'd)
 * @param {string} eventId - Event ID
 * @returns {boolean}
 */
export function isExcluded(eventId) {
    const data = loadData();
    return data.excluded?.includes(eventId) || false;
}

/**
 * Toggle excluded status for an event
 * @param {string} eventId - Event ID
 * @returns {boolean} New excluded status
 */
export function toggleExcluded(eventId) {
    const data = loadData();
    if (!data.excluded) data.excluded = [];

    const index = data.excluded.indexOf(eventId);
    if (index > -1) {
        data.excluded.splice(index, 1);
    } else {
        data.excluded.push(eventId);
    }

    saveData(data);
    return data.excluded.includes(eventId);
}

/**
 * Get custom caption for a memory
 * @param {string} memoryId - Memory ID
 * @returns {string|null} Custom caption or null
 */
export function getMemoryCaption(memoryId) {
    const data = loadData();
    return data.memoryCaptions?.[memoryId] || null;
}

/**
 * Save custom caption for a memory
 * @param {string} memoryId - Memory ID
 * @param {string} caption - New caption
 */
export function saveMemoryCaption(memoryId, caption) {
    const data = loadData();
    if (!data.memoryCaptions) data.memoryCaptions = {};
    data.memoryCaptions[memoryId] = caption;
    saveData(data);
}

/**
 * Check if user has seen the book intro
 * @returns {boolean}
 */
export function hasSeenIntro() {
    const data = loadData();
    return data.hasSeenIntro || false;
}

/**
 * Mark intro as seen
 */
export function markIntroSeen() {
    const data = loadData();
    data.hasSeenIntro = true;
    saveData(data);
}

/**
 * Load OSM venue cache
 * @returns {Object|null} Cached OSM data or null
 */
export function loadOSMCache() {
    const cached = localStorage.getItem(OSM_CACHE_KEY);
    if (!cached) return null;

    try {
        const data = JSON.parse(cached);
        if (Date.now() - data.lastFetch < OSM_CACHE_DURATION) {
            osmVenueData = data;
            logger.debug('Storage', `OSM cache loaded: ${osmVenueData.restaurants.length} restaurants, ${osmVenueData.bars.length} bars`);
            return data;
        }
    } catch (e) {
        logger.warn('Storage', 'OSM Cache invalid:', e);
    }

    return null;
}

/**
 * Save OSM venue cache
 * @param {Object} data - OSM venue data to cache
 */
export function saveOSMCache(data) {
    try {
        localStorage.setItem(OSM_CACHE_KEY, JSON.stringify(data));
    } catch (e) {
        logger.warn('Storage', 'Could not cache OSM data:', e);
    }
}

/**
 * Clear all app data (reset)
 */
export function clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OSM_CACHE_KEY);
}
