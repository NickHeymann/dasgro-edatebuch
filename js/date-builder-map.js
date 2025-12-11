/**
 * Date Builder Map Module
 * Handles Leaflet map visualization for date plans
 */

import logger from './logger.js';
import { HAMBURG_COORDS } from './config.js';
import { getPlan } from './date-builder.js';

let map = null;

/**
 * Initialize the Leaflet map (lazy, called when section opens)
 */
export function initMap() {
    if (map) return map;

    const mapContainer = document.getElementById('dateBuilderMap');
    if (!mapContainer) return null;

    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        logger.warn('DateBuilderMap', 'Leaflet not loaded');
        return null;
    }

    const { lat, lon } = HAMBURG_COORDS;
    map = L.map('dateBuilderMap').setView([lat, lon], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    logger.success('DateBuilderMap', 'Map initialized');
    return map;
}

/**
 * Get the map instance
 */
export function getMap() {
    return map;
}

/**
 * Update map markers based on current plan
 */
export function updateMap() {
    if (!map) return;

    const plan = getPlan();
    if (!plan.event) return;

    // Remove existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    const e = plan.event;
    const markers = [];

    // Event location
    if (e.coords) {
        L.marker(e.coords).addTo(map).bindPopup(`${e.emoji} ${e.title}`);
        markers.push(e.coords);
    }

    // Restaurant location
    if (plan.food !== 'nein' && e.restaurant?.coords) {
        L.marker(e.restaurant.coords).addTo(map).bindPopup(`🍽️ ${e.restaurant.name}`);
        markers.push(e.restaurant.coords);
    }

    // Bar location
    if (plan.drinks === 'ja' && e.bar) {
        const bar = Array.isArray(e.bar) ? e.bar[0] : e.bar;
        if (bar.coords) {
            L.marker(bar.coords).addTo(map).bindPopup(`🍸 ${bar.name}`);
            markers.push(bar.coords);
        }
    }

    // Fit map to show all markers
    if (markers.length > 0) {
        map.fitBounds(L.latLngBounds(markers), { padding: [50, 50] });
    }
}

/**
 * Reset map to default view
 */
export function resetMap() {
    if (!map) return;

    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });
    map.setView([HAMBURG_COORDS.lat, HAMBURG_COORDS.lon], 12);
}
