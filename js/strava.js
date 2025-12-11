/**
 * Strava Module (Stub)
 * TODO: Requires server backend for OAuth token exchange
 *
 * Um Strava zu aktivieren:
 * 1. Strava App erstellen: https://www.strava.com/settings/api
 * 2. Backend für Token-Exchange implementieren
 * 3. STRAVA_CLIENT_ID hier setzen
 */

import logger from './logger.js';
import { showToast } from './utils.js';

const STORAGE_KEY = 'strava_tokens';
let connected = false;

export function init() {
    connected = !!localStorage.getItem(STORAGE_KEY);
    updateUI();
}

export function isConnected() {
    return connected;
}

export function connect() {
    showToast('⚠️ Strava benötigt Server-Backend');
    logger.warn('Strava', 'OAuth requires server-side token exchange');

    // Demo: Simulate connection for UI testing
    if (confirm('Demo-Modus aktivieren? (Keine echten Daten)')) {
        localStorage.setItem(STORAGE_KEY, 'demo');
        connected = true;
        updateUI();
        showToast('✅ Strava Demo aktiv');
    }
}

export function disconnect() {
    localStorage.removeItem(STORAGE_KEY);
    connected = false;
    updateUI();
    showToast('Strava getrennt');
}

function updateUI() {
    const card = document.querySelector('.strava-card');
    const status = document.querySelector('.strava-card .travel-card-status');
    if (card) card.classList.toggle('connected', connected);
    if (status) status.textContent = connected ? 'Demo' : 'Nicht verbunden';
}

// Stub functions for future implementation
export function fetchActivities() { return []; }
export function getActivities() { return []; }
export function getWeeklyStats() { return { runs: 0, distance: '0', time: 0, avgPace: '--' }; }

if (typeof window !== 'undefined') {
    window.connectStrava = connect;
    window.disconnectStrava = disconnect;
}
