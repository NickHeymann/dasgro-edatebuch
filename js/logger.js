/**
 * Logger Module
 * Centralized logging with debug levels and environment control
 */

// Debug-Level: 0 = off, 1 = errors only, 2 = warnings, 3 = info, 4 = debug (verbose)
const DEBUG_LEVEL = localStorage.getItem('debugLevel')
    ? parseInt(localStorage.getItem('debugLevel'))
    : (window.location.hostname === 'localhost' ? 3 : 1);

// Color codes for different log types
const COLORS = {
    error: '#ff6b6b',
    warn: '#feca57',
    info: '#54a0ff',
    debug: '#a8c5a0',
    success: '#26de81'
};

// Emoji prefixes for visual distinction
const PREFIXES = {
    error: '❌',
    warn: '⚠️',
    info: 'ℹ️',
    debug: '🔧',
    success: '✅'
};

/**
 * Format log message with timestamp and module name
 */
function formatMessage(level, module, message) {
    const time = new Date().toLocaleTimeString('de-DE');
    return [`%c${PREFIXES[level]} [${time}] [${module}]`, `color: ${COLORS[level]}; font-weight: bold`, message];
}

/**
 * Main logger object
 */
const logger = {
    /**
     * Log an error (always shown unless DEBUG_LEVEL = 0)
     */
    error(module, message, ...args) {
        if (DEBUG_LEVEL >= 1) {
            console.error(...formatMessage('error', module, message), ...args);
        }
    },

    /**
     * Log a warning (shown at DEBUG_LEVEL >= 2)
     */
    warn(module, message, ...args) {
        if (DEBUG_LEVEL >= 2) {
            console.warn(...formatMessage('warn', module, message), ...args);
        }
    },

    /**
     * Log info (shown at DEBUG_LEVEL >= 3)
     */
    info(module, message, ...args) {
        if (DEBUG_LEVEL >= 3) {
            console.info(...formatMessage('info', module, message), ...args);
        }
    },

    /**
     * Log debug/verbose (shown at DEBUG_LEVEL >= 4)
     */
    debug(module, message, ...args) {
        if (DEBUG_LEVEL >= 4) {
            console.log(...formatMessage('debug', module, message), ...args);
        }
    },

    /**
     * Log success (shown at DEBUG_LEVEL >= 3)
     */
    success(module, message, ...args) {
        if (DEBUG_LEVEL >= 3) {
            console.log(...formatMessage('success', module, message), ...args);
        }
    },

    /**
     * Set debug level dynamically
     */
    setLevel(level) {
        localStorage.setItem('debugLevel', level);
        console.log(`Debug level set to ${level}. Reload page to apply.`);
    },

    /**
     * Get current debug level
     */
    getLevel() {
        return DEBUG_LEVEL;
    }
};

// Make logger available globally for debugging in console
window.logger = logger;

// Quick shortcuts for console
window.setDebugLevel = logger.setLevel;

export default logger;
