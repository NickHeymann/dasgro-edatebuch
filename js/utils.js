/**
 * Utility Functions Module
 * Helper functions used throughout the app
 * - Date formatting
 * - Distance calculations
 * - Toast notifications
 * - Opening hours parsing
 * - Venue status checking
 */

/**
 * Format date to German locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('de-DE', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default 2500)
 */
export function showToast(message, duration = 2500) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

/**
 * Get bar name(s) from bar object (handles single or array)
 * @param {Object|Array} bar - Bar object or array of bars
 * @returns {string} Bar name(s)
 */
export function getBarName(bar) {
    if (!bar) return '';
    if (Array.isArray(bar)) {
        return bar.map(b => b.name).join(', ');
    }
    return bar.name;
}

/**
 * Get category emoji
 * @param {string} category - Category name
 * @returns {string} Emoji for category
 */
export function getCategoryEmoji(category) {
    const emojis = {
        wellness: '💆‍♀️',
        aktiv: '🏃‍♀️',
        handwerk: '🧶',
        comedy: '😂',
        essen: '🍽️',
        musik: '🎵',
        shows: '🎭',
        musical: '🎤',
        theater: '🎭',
        variete: '✨',
        ausstellung: '🖼️'
    };
    return emojis[category] || '📌';
}

