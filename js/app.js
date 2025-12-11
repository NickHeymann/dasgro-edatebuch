/**
 * Main Application Entry Point
 * Initializes all modules and starts the app
 * - Auth check on load
 * - Module initialization
 * - Book intro animation
 * - Theme management
 */

// Import all modules
import logger from './logger.js';
import * as storage from './storage.js';
import * as utils from './utils.js';
import * as auth from './auth.js';
import * as events from './events.js';
import * as navigation from './navigation.js';
import * as calendar from './calendar.js';
import * as weather from './weather.js';
import * as globe from './globe.js';
import * as memories from './memories.js';
import * as roulette from './roulette.js';
import * as dateBuilder from './date-builder.js';
import * as dateBuilderExport from './date-builder-export.js';
import * as dateBuilderMap from './date-builder-map.js';
import * as eventsRender from './events-render.js';
import * as themeSwitcher from './theme-switcher.js';

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

let initialized = false;

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Main initialization function
 */
async function initApp() {
    if (initialized) return;
    initialized = true;

    logger.info('App', 'Initializing Datebuch App...');

    // Check authentication first
    if (!auth.checkSession()) {
        // Show login form, don't continue init
        return;
    }

    // Initialize all modules
    try {
        // Load events first (other modules depend on it)
        const allEvents = await events.init();

        // Initialize navigation with events
        navigation.init(allEvents);
        navigation.setEvents(allEvents);

        // Initialize calendar with events
        calendar.init(allEvents);

        // Connect events render function
        events.setRenderFunction(eventsRender.render);

        // Initialize other modules
        weather.init();
        memories.init();
        dateBuilder.init();

        // Connect date builder modules
        dateBuilder.setOnPlanChange((changeType) => {
            if (changeType === 'reset') {
                dateBuilder.hideSummary();
                dateBuilderMap.resetMap();
            } else if (changeType === 'category') {
                dateBuilder.hideSummary();
            } else {
                dateBuilder.updateSummary();
                dateBuilderMap.updateMap();
            }
        });

        // Render events
        eventsRender.render();

        logger.success('App', 'All modules initialized');

        // Check if user should see book intro
        const data = storage.loadData();
        if (!data.hasSeenIntro) {
            showBookIntro();
        }

        // Setup global event listeners
        setupGlobalListeners();

        // Dark mode initialization
        initDarkMode();

        // Design theme initialization (Design System)
        themeSwitcher.init();

        // Update calendar widget
        calendar.updateNextEventWidget();

    } catch (error) {
        logger.error('App', 'Error initializing app:', error);
        utils.showToast('Fehler beim Laden der App');
    }
}

/**
 * Show book opening animation
 */
function showBookIntro() {
    const intro = document.getElementById('bookIntro');
    if (!intro) return;

    // Book is visible by default, user can click to open
    const openBtn = document.getElementById('openBookBtn');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            openBook();
        });
    }
}

/**
 * Open book animation
 */
function openBook() {
    const book = document.getElementById('book3d');
    const intro = document.getElementById('bookIntro');

    if (!book || !intro) return;

    book.classList.add('opening');

    // Wait for animation, then fade out
    setTimeout(() => {
        intro.style.opacity = '0';
        intro.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            intro.classList.add('hidden');
            storage.markIntroSeen();
        }, 500);
    }, 3200); // 1.2s open + 2s display
}

/**
 * Setup global event listeners
 */
function setupGlobalListeners() {
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 500);
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Dark mode toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }

    // Modal backdrop click to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

/**
 * Initialize dark mode from saved preference
 */
function initDarkMode() {
    const savedTheme = localStorage.getItem('datebuch_theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('datebuch_theme', newTheme);

    utils.showToast(newTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode');
}

// ═══════════════════════════════════════════════════════════════════
// APP ENTRY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Enter the app from intro screen
 */
function enterApp() {
    const intro = document.getElementById('intro');
    const app = document.getElementById('app');

    if (intro) {
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.style.display = 'none';
            if (app) app.classList.add('visible');
        }, 800);
    }
}

/**
 * Scroll to top helper
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Close any modal by ID
 * @param {string} modalId
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL EXPORTS
// ═══════════════════════════════════════════════════════════════════

// Export for debugging
if (typeof window !== 'undefined') {
    window.debugApp = {
        storage,
        utils,
        events,
        navigation,
        calendar,
        globe,
        memories,
        themeSwitcher
    };

    // Global handlers for HTML onclick
    window.enterApp = enterApp;
    window.scrollToTop = scrollToTop;
    window.closeModal = closeModal;
    window.toggleTheme = toggleDarkMode;
}

// ═══════════════════════════════════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════════════════════════════════

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for ES modules
export { initApp, enterApp };
