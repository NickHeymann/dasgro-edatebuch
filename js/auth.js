/**
 * Authentication Module
 * Handles login, logout, and session management
 * - SHA-256 password hashing
 * - Session persistence (7 days)
 * - Face ID / Touch ID support (Safari Keychain)
 */

import { showToast } from './utils.js';

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const AUTH_STORAGE_KEY = 'datebuch_auth';
const PASSWORD_HASH = '22b174f2186e672e39ceab3749f2b41601dd662dedcc24baebb6c456db77cdba';
const PASSWORD_SALT = 'datebuch_salt_ns';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// ═══════════════════════════════════════════════════════════════════
// HASHING
// ═══════════════════════════════════════════════════════════════════

/**
 * Hash password using SHA-256
 * @param {string} password - Password to hash
 * @returns {Promise<string>} Hex-encoded hash
 */
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + PASSWORD_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ═══════════════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

/**
 * Check if user has valid session
 * @returns {boolean} True if authenticated
 */
export function checkSession() {
    try {
        const session = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{}');
        if (session.authenticated && session.expires > Date.now()) {
            return true;
        }
    } catch (e) {
        console.warn('Session check error:', e);
    }
    return false;
}

/**
 * Save authentication session
 */
export function saveSession() {
    const session = {
        authenticated: true,
        expires: Date.now() + SESSION_DURATION
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

/**
 * Clear authentication session
 */
export function clearSession() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

// ═══════════════════════════════════════════════════════════════════
// LOGIN / LOGOUT
// ═══════════════════════════════════════════════════════════════════

/**
 * Attempt login with password
 * @param {string} password - Password to verify
 * @returns {Promise<boolean>} True if login successful
 */
export async function login(password) {
    try {
        const hash = await hashPassword(password);
        if (hash === PASSWORD_HASH) {
            saveSession();
            return true;
        }
    } catch (err) {
        console.error('Login error:', err);
    }
    return false;
}

/**
 * Logout current user
 */
export function logout() {
    clearSession();
    location.reload();
}

// ═══════════════════════════════════════════════════════════════════
// UI HANDLERS (for use in HTML onclick)
// ═══════════════════════════════════════════════════════════════════

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
export async function handleLogin(event) {
    event.preventDefault();

    const passwordInput = document.getElementById('loginPassword');
    const errorEl = document.getElementById('loginError');
    const btnEl = document.getElementById('loginBtn');

    const password = passwordInput.value;

    if (!password) {
        if (errorEl) errorEl.textContent = 'Bitte Passwort eingeben';
        return;
    }

    if (btnEl) {
        btnEl.disabled = true;
        btnEl.textContent = 'Prüfe...';
    }

    const success = await login(password);

    if (success) {
        const loginScreen = document.getElementById('loginScreen');
        if (loginScreen) {
            loginScreen.classList.add('fade-out');
            setTimeout(() => loginScreen.classList.add('hidden'), 800);
        }
        showToast('✅ Willkommen!');
    } else {
        if (errorEl) errorEl.textContent = 'Falsches Passwort';
        if (passwordInput) {
            passwordInput.classList.add('error');
            passwordInput.value = '';
            setTimeout(() => passwordInput.classList.remove('error'), 500);
        }
    }

    if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = 'Entsperren →';
    }
}

/**
 * Initialize auth module - check session on load
 */
export function init() {
    if (checkSession()) {
        const loginScreen = document.getElementById('loginScreen');
        if (loginScreen) {
            loginScreen.classList.add('hidden');
        }
    }
}

/**
 * Trigger biometric authentication (Face ID / Touch ID)
 * Uses Safari Keychain autofill
 */
export function triggerBiometric() {
    const passwordInput = document.getElementById('loginPassword');
    if (passwordInput) {
        // Focus triggers Safari's password autofill with biometrics
        passwordInput.focus();
        // Attempt to trigger credential manager
        if (navigator.credentials && navigator.credentials.get) {
            navigator.credentials.get({
                password: true,
                mediation: 'optional'
            }).then(credential => {
                if (credential && credential.password) {
                    passwordInput.value = credential.password;
                    // Auto-submit
                    const form = passwordInput.closest('form');
                    if (form) form.dispatchEvent(new Event('submit'));
                }
            }).catch(() => {
                // Fallback: just focus the input for Safari autofill
                showToast('Tippe auf das Passwort-Feld für Face ID');
            });
        }
    }
}

// Make handlers available globally for HTML onclick
if (typeof window !== 'undefined') {
    window.handleLogin = handleLogin;
    window.logout = logout;
    window.triggerBiometric = triggerBiometric;
}
