/**
 * Design Token Build Script
 * Transforms JSON tokens to CSS custom properties
 *
 * Usage: node scripts/build-tokens.js [theme]
 * Example: node scripts/build-tokens.js romantic
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOKENS_DIR = path.join(__dirname, '..', 'tokens');
const OUTPUT_DIR = path.join(__dirname, '..', 'css', 'themes');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Flatten nested token object to CSS variable format
 * { color: { primary: { base: "#fff" }}} => { --color-primary-base: "#fff" }
 */
function flattenTokens(obj, prefix = '') {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        // Skip meta fields
        if (key === '$schema' || key === 'meta') continue;

        const cssKey = prefix ? `${prefix}-${key}` : key;

        if (value && typeof value === 'object' && !value.value) {
            // Nested object, recurse
            Object.assign(result, flattenTokens(value, cssKey));
        } else if (value && value.value !== undefined) {
            // Token with value
            result[`--${cssKey}`] = value.value;
        }
    }

    return result;
}

/**
 * Generate CSS from flattened tokens
 */
function generateCSS(tokens, selector = ':root') {
    const lines = Object.entries(tokens)
        .map(([key, value]) => `    ${key}: ${value};`)
        .join('\n');

    return `${selector} {\n${lines}\n}`;
}

/**
 * Build a single theme
 */
function buildTheme(themeName) {
    console.log(`Building theme: ${themeName}`);

    // Load base tokens
    const baseTokens = JSON.parse(
        fs.readFileSync(path.join(TOKENS_DIR, 'base.json'), 'utf8')
    );

    // Load theme tokens
    const themeFile = path.join(TOKENS_DIR, `theme-${themeName}.json`);
    if (!fs.existsSync(themeFile)) {
        console.error(`Theme file not found: ${themeFile}`);
        return null;
    }

    const themeTokens = JSON.parse(fs.readFileSync(themeFile, 'utf8'));

    // Flatten and merge
    const flatBase = flattenTokens(baseTokens);
    const flatTheme = flattenTokens(themeTokens);
    const merged = { ...flatBase, ...flatTheme };

    // Generate CSS
    const css = `/* ================================================
   ${themeTokens.meta?.name || themeName} Theme
   Generated from Design Tokens - DO NOT EDIT MANUALLY
   ${new Date().toISOString()}
   ================================================ */

${generateCSS(merged, ':root')}

/* Theme attribute selector for switching */
[data-design-theme="${themeName}"] {
${Object.entries(merged).map(([key, value]) => `    ${key}: ${value};`).join('\n')}
}
`;

    // Write CSS file
    const outputFile = path.join(OUTPUT_DIR, `theme-${themeName}.css`);
    fs.writeFileSync(outputFile, css);
    console.log(`  -> ${outputFile}`);

    return merged;
}

/**
 * Build all themes
 */
function buildAllThemes() {
    console.log('\\n=== Datebuch Design Token Builder ===\\n');

    const themes = fs.readdirSync(TOKENS_DIR)
        .filter(f => f.startsWith('theme-') && f.endsWith('.json'))
        .map(f => f.replace('theme-', '').replace('.json', ''));

    console.log(`Found themes: ${themes.join(', ')}\\n`);

    const allTokens = {};

    for (const theme of themes) {
        allTokens[theme] = buildTheme(theme);
    }

    // Generate combined CSS with all themes
    const combinedCSS = themes.map(theme => {
        return `@import "theme-${theme}.css";`;
    }).join('\n');

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'index.css'),
        `/* Import all themes */\n${combinedCSS}\n`
    );

    console.log('\\n=== Build complete! ===\\n');
    console.log('Usage in HTML:');
    console.log('  <link rel="stylesheet" href="css/themes/theme-romantic.css">');
    console.log('  Or switch dynamically: document.documentElement.dataset.designTheme = "modern"');

    return allTokens;
}

// CLI entry point
const args = process.argv.slice(2);

if (args[0]) {
    buildTheme(args[0]);
} else {
    buildAllThemes();
}
