/**
 * Theme Switcher Module
 * Dynamically switch between design themes
 * Press Ctrl+Shift+T to open Theme Preview Panel
 * @module theme-switcher
 */

import logger from './logger.js';
import { loadData, saveData } from './storage.js';

// Available themes with metadata
const THEMES = {
    romantic: {
        name: 'Romantic',
        colors: ['#f472b6', '#10b981', '#f59e0b']
    },
    modern: {
        name: 'Modern',
        colors: ['#6366f1', '#0ea5e9', '#8b5cf6']
    },
    playful: {
        name: 'Playful',
        colors: ['#f97316', '#14b8a6', '#f43f5e']
    },
    cozy: {
        name: 'Cozy',
        colors: ['#d97706', '#92400e', '#fef3c7']
    },
    minimalist: {
        name: 'Minimalist',
        colors: ['#000000', '#404040', '#ffffff']
    },
    vibrant: {
        name: 'Vibrant',
        colors: ['#e11d48', '#7c3aed', '#059669']
    },
    elegant: {
        name: 'Elegant',
        colors: ['#d4af37', '#1e293b', '#9333ea']
    }
};
const DEFAULT_THEME = 'romantic';
const STORAGE_KEY = 'designTheme';

/**
 * Get current theme from storage
 * @returns {string}
 */
function getCurrentTheme() {
    const data = loadData();
    return data[STORAGE_KEY] || DEFAULT_THEME;
}

/**
 * Apply theme to document
 * @param {string} themeName
 */
function applyTheme(themeName) {
    if (!THEMES[themeName]) {
        logger.warn('ThemeSwitcher', `Unknown theme: ${themeName}, falling back to ${DEFAULT_THEME}`);
        themeName = DEFAULT_THEME;
    }

    // Set data attribute for CSS (themes are defined in variables.css)
    document.documentElement.dataset.designTheme = themeName;

    // Update panel if exists
    updatePanelSelection(themeName);

    logger.info('ThemeSwitcher', `Applied theme: ${themeName}`);
}

/**
 * Set and persist theme
 * @param {string} themeName
 */
export function setTheme(themeName) {
    applyTheme(themeName);

    // Persist to storage
    const data = loadData();
    data[STORAGE_KEY] = themeName;
    saveData(data);

    // Dispatch event for other modules
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: themeName } }));
}

/**
 * Get list of available themes
 * @returns {Object}
 */
export function getThemes() {
    return { ...THEMES };
}

/**
 * Cycle through themes (for quick testing)
 */
export function cycleTheme() {
    const current = getCurrentTheme();
    const themeKeys = Object.keys(THEMES);
    const currentIndex = themeKeys.indexOf(current);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
}

// ═══════════════════════════════════════════════════════════════════
// THEME PREVIEW PANEL
// ═══════════════════════════════════════════════════════════════════

let panelElement = null;

/**
 * Create theme preview panel HTML
 */
function createPanel() {
    if (panelElement) return panelElement;

    const panel = document.createElement('div');
    panel.className = 'theme-panel';
    panel.id = 'themePanel';

    const currentTheme = getCurrentTheme();

    panel.innerHTML = `
        <div class="theme-panel-header">
            <span class="theme-panel-title">Design Theme</span>
            <button class="theme-panel-close" onclick="window.toggleThemePanel()">×</button>
        </div>
        <div class="theme-options">
            ${Object.entries(THEMES).map(([key, theme]) => `
                <div class="theme-option ${key === currentTheme ? 'active' : ''}" data-theme="${key}" onclick="window.setDesignTheme('${key}')">
                    <div class="theme-swatch">
                        ${theme.colors.map(color => `<div class="theme-swatch-color" style="background:${color}"></div>`).join('')}
                    </div>
                    <span class="theme-option-name">${theme.name}</span>
                </div>
            `).join('')}
        </div>
        <div class="theme-panel-hint">
            <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>K</kbd> to toggle
        </div>
    `;

    document.body.appendChild(panel);
    panelElement = panel;
    return panel;
}

/**
 * Update panel selection state
 * @param {string} themeName
 */
function updatePanelSelection(themeName) {
    if (!panelElement) return;

    panelElement.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === themeName);
    });
}

/**
 * Toggle theme preview panel visibility
 */
export function togglePanel() {
    const panel = createPanel();
    panel.classList.toggle('visible');
}

/**
 * Show theme preview panel
 */
export function showPanel() {
    const panel = createPanel();
    panel.classList.add('visible');
}

/**
 * Hide theme preview panel
 */
export function hidePanel() {
    if (panelElement) {
        panelElement.classList.remove('visible');
    }
}

/**
 * Initialize theme switcher
 */
export function init() {
    const savedTheme = getCurrentTheme();
    applyTheme(savedTheme);

    // Setup keyboard shortcut (Cmd+K on Mac, Ctrl+K on Windows) - K for "Kolors/Design"
    document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modifierKey = isMac ? e.metaKey : e.ctrlKey;

        if (modifierKey && e.shiftKey && e.key === 'K') {
            e.preventDefault();
            togglePanel();
        }
    });

    const shortcut = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘+Shift+K' : 'Ctrl+Shift+K';
    logger.success('ThemeSwitcher', `Initialized with theme: ${savedTheme} (${shortcut} for panel)`);
}

// Expose to window for debugging and quick access
if (typeof window !== 'undefined') {
    window.setDesignTheme = setTheme;
    window.cycleDesignTheme = cycleTheme;
    window.getDesignThemes = getThemes;
    window.toggleThemePanel = togglePanel;
    window.showThemePanel = showPanel;
    window.hideThemePanel = hidePanel;
}

export default { init, setTheme, getThemes, cycleTheme, togglePanel, showPanel, hidePanel };
