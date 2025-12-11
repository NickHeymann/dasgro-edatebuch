/**
 * Weather Module
 * Weather widget using Open-Meteo API
 * - Current temperature
 * - Weather condition icon
 * - Hamburg location
 */

import logger from './logger.js';

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const HAMBURG_COORDS = { lat: 53.55, lon: 10.0 };

// Weather code to emoji mapping
const WEATHER_EMOJIS = {
    0: '☀️',   // Clear sky
    1: '🌤️',   // Mainly clear
    2: '⛅',   // Partly cloudy
    3: '☁️',   // Overcast
    45: '🌫️',  // Fog
    48: '🌫️',  // Depositing rime fog
    51: '🌧️',  // Light drizzle
    53: '🌧️',  // Moderate drizzle
    55: '🌧️',  // Dense drizzle
    61: '🌧️',  // Slight rain
    63: '🌧️',  // Moderate rain
    65: '🌧️',  // Heavy rain
    71: '🌨️',  // Slight snow
    73: '🌨️',  // Moderate snow
    75: '🌨️',  // Heavy snow
    77: '🌨️',  // Snow grains
    80: '🌦️',  // Slight rain showers
    81: '🌦️',  // Moderate rain showers
    82: '🌦️',  // Violent rain showers
    85: '🌨️',  // Slight snow showers
    86: '🌨️',  // Heavy snow showers
    95: '⛈️',  // Thunderstorm
    96: '⛈️',  // Thunderstorm with slight hail
    99: '⛈️'   // Thunderstorm with heavy hail
};

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize weather module
 */
export function init() {
    load();
}

// ═══════════════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════════════

/**
 * Fetch and display current weather
 */
export async function load() {
    try {
        const { lat, lon } = HAMBURG_COORDS;
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        if (!response.ok) {
            throw new Error('Weather API error');
        }

        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        const emoji = getWeatherEmoji(code);

        updateUI(temp, emoji);
    } catch (e) {
        logger.debug('Weather', 'Weather loading failed:', e.message);
        // Show fallback
        updateUI('--', '🌡️');
    }
}

/**
 * Get emoji for weather code
 * @param {number} code - WMO weather code
 * @returns {string} Weather emoji
 */
function getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code < 3) return '⛅';
    if (code < 50) return '☁️';
    if (code < 60) return '🌧️';
    if (code < 70) return '🌧️';
    if (code < 80) return '🌨️';
    if (code < 90) return '🌦️';
    return '⛈️';
}

// ═══════════════════════════════════════════════════════════════════
// UI
// ═══════════════════════════════════════════════════════════════════

/**
 * Update weather UI elements
 * @param {number|string} temp - Temperature
 * @param {string} emoji - Weather emoji
 */
function updateUI(temp, emoji) {
    const tempEl = document.getElementById('weatherTemp');
    const widgetEl = document.getElementById('weatherWidget');

    if (tempEl) {
        tempEl.textContent = `${temp}°`;
    }

    if (widgetEl) {
        const emojiSpan = widgetEl.querySelector('span');
        if (emojiSpan) {
            emojiSpan.textContent = emoji;
        }
    }
}

/**
 * Check if it's good weather for outdoor activities
 * @returns {Promise<boolean>} True if good weather
 */
export async function isGoodWeather() {
    try {
        const { lat, lon } = HAMBURG_COORDS;
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        const data = await response.json();
        const temp = data.current_weather.temperature;
        const code = data.current_weather.weathercode;

        // Good weather: temp > 10°C and no rain/snow
        return temp > 10 && code < 50;
    } catch (e) {
        return true; // Assume good weather if API fails
    }
}
