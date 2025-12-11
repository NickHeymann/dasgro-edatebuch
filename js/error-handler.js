/**
 * Error Handler Module
 * Simple global error handling
 */

import logger from './logger.js';

let errorCount = 0;
const MAX_ERRORS = 10;

/**
 * Initialize global error handlers
 */
export function init() {
    window.onerror = (message, source, lineno, colno, error) => {
        handleError('uncaught', message, error);
        return true;
    };

    window.onunhandledrejection = (event) => {
        handleError('promise', event.reason?.message || 'Promise rejection', event.reason);
    };

    logger.debug('ErrorHandler', 'Initialized');
}

/**
 * Handle an error
 */
function handleError(type, message, error) {
    errorCount++;
    logger.error('ErrorHandler', `[${type}] ${message}`, error);

    // Show reload prompt after too many errors
    if (errorCount >= MAX_ERRORS && !document.querySelector('.error-overlay')) {
        showErrorOverlay();
    }
}

/**
 * Safe wrapper for module initialization
 */
export async function safeInit(moduleName, initFn) {
    try {
        await initFn();
        logger.debug('ErrorHandler', `${moduleName} OK`);
        return true;
    } catch (error) {
        logger.error('ErrorHandler', `${moduleName} failed:`, error);
        return false;
    }
}

/**
 * Show simple error overlay
 */
function showErrorOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'error-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:99999;';
    overlay.innerHTML = `
        <div style="background:white;padding:40px;border-radius:20px;text-align:center;max-width:300px;">
            <h2 style="color:#ff6b6b;margin-bottom:16px;">Ups!</h2>
            <p>Etwas ist schief gelaufen.</p>
            <button onclick="location.reload()" style="padding:12px 24px;background:#4ade80;color:white;border:none;border-radius:10px;cursor:pointer;margin-top:20px;">
                🔄 Neu laden
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * Get error count for debugging
 */
export function getErrorCount() {
    return errorCount;
}
