/**
 * Komoot Module (Stub)
 * TODO: Requires server backend for OAuth token exchange
 *
 * Um Komoot zu aktivieren:
 * 1. Komoot Developer Account: https://www.komoot.com/api
 * 2. Backend für Token-Exchange implementieren
 * 3. KOMOOT_CLIENT_ID hier setzen
 */

import logger from './logger.js';
import { showToast } from './utils.js';

const STORAGE_KEY = 'komoot_tokens';
let connected = false;

export function init() {
    connected = !!localStorage.getItem(STORAGE_KEY);
    updateUI();
}

export function isConnected() {
    return connected;
}

export function connect() {
    showToast('⚠️ Komoot benötigt Server-Backend');
    logger.warn('Komoot', 'OAuth requires server-side token exchange');

    // Demo: Simulate connection for UI testing
    if (confirm('Demo-Modus aktivieren? (Keine echten Daten)')) {
        localStorage.setItem(STORAGE_KEY, 'demo');
        connected = true;
        updateUI();
        showToast('✅ Komoot Demo aktiv');
    }
}

export function disconnect() {
    localStorage.removeItem(STORAGE_KEY);
    connected = false;
    updateUI();
    showToast('Komoot getrennt');
}

function updateUI() {
    const card = document.querySelector('.komoot-card');
    const status = document.querySelector('.komoot-card .travel-card-status');
    if (card) card.classList.toggle('connected', connected);
    if (status) status.textContent = connected ? 'Demo' : 'Nicht verbunden';
}

// Stub functions for future implementation
export function fetchTours() { return []; }
export function getTours() { return []; }
export function getSuggestions() { return []; }

if (typeof window !== 'undefined') {
    window.connectKomoot = connect;
    window.disconnectKomoot = disconnect;
}
