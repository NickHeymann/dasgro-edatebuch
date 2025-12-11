/**
 * Memories Module
 * Photo gallery with lightbox and editable captions
 * - Polaroid-style grid
 * - Lightbox with navigation
 * - Custom titles saved in localStorage
 */

import { MEMORIES_DATA } from './config.js';
import { loadData, saveData } from './storage.js';
import { showToast } from './utils.js';

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

let currentIndex = 0;

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize memories module
 */
export function init() {
    render();
    setupKeyboardNavigation();
}

// ═══════════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get custom titles from storage
 * @returns {Object} Titles keyed by file path
 */
function getCustomTitles() {
    const data = loadData();
    return data.memoryTitles || {};
}

/**
 * Save custom title
 * @param {string} file - File path
 * @param {string} title - New title
 */
function saveCustomTitle(file, title) {
    const data = loadData();
    if (!data.memoryTitles) data.memoryTitles = {};
    data.memoryTitles[file] = title;
    saveData(data);
}

// ═══════════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════════

/**
 * Render memories grid
 */
export function render() {
    const container = document.getElementById('memoriesGrid');
    if (!container) return;

    const customTitles = getCustomTitles();

    const html = MEMORIES_DATA.map((mem, index) => {
        const title = customTitles[mem.image] || mem.caption;
        return `
            <div class="memory-item" onclick="openLightbox(${index})">
                <img src="${mem.image}" alt="${title}" onerror="this.parentElement.style.display='none'">
                <div class="memory-caption">${title}</div>
                <div class="memory-edit" onclick="event.stopPropagation();editMemoryTitle(${index})">✏️</div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════════════════════════

/**
 * Open lightbox at specific index
 * @param {number} index - Memory index
 */
export function openLightbox(index) {
    currentIndex = index;
    const mem = MEMORIES_DATA[index];
    const customTitles = getCustomTitles();
    const title = customTitles[mem.image] || mem.caption;

    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const lightbox = document.getElementById('lightbox');

    if (img) img.src = mem.image;
    if (caption) caption.textContent = title;
    if (lightbox) lightbox.classList.add('active');
}

/**
 * Close lightbox
 */
export function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
}

/**
 * Navigate lightbox
 * @param {number} dir - Direction (-1 or 1)
 */
export function navigate(dir) {
    currentIndex = (currentIndex + dir + MEMORIES_DATA.length) % MEMORIES_DATA.length;
    const mem = MEMORIES_DATA[currentIndex];
    const customTitles = getCustomTitles();
    const title = customTitles[mem.image] || mem.caption;

    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');

    if (img) img.src = mem.image;
    if (caption) caption.textContent = title;
}

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });
}

// ═══════════════════════════════════════════════════════════════════
// EDIT TITLES
// ═══════════════════════════════════════════════════════════════════

/**
 * Edit memory title
 * @param {number} index - Memory index
 */
export function editTitle(index) {
    const mem = MEMORIES_DATA[index];
    const customTitles = getCustomTitles();
    const currentTitle = customTitles[mem.image] || mem.caption;

    const newTitle = prompt('Titel bearbeiten:', currentTitle);
    if (newTitle && newTitle !== currentTitle) {
        saveCustomTitle(mem.image, newTitle);
        render();
        showToast('📝 Titel gespeichert!');
    }
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL HANDLERS
// ═══════════════════════════════════════════════════════════════════

// Make handlers available globally for HTML onclick
if (typeof window !== 'undefined') {
    window.openLightbox = openLightbox;
    window.closeLightbox = closeLightbox;
    window.navigateLightbox = navigate;
    window.editMemoryTitle = editTitle;
}
