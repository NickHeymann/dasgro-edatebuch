/**
 * Date Builder Export Module
 * Handles sharing and exporting date plans
 * - WhatsApp sharing
 * - Calendar (.ics) export
 * - ÖPNV route from work
 */

import { WORK_ADDRESS } from './config.js';
import { showToast, formatDate, getBarName } from './utils.js';
import { getPlan } from './date-builder.js';

/**
 * Share date plan via WhatsApp
 */
export function shareWhatsApp() {
    const plan = getPlan();
    if (!plan.event) {
        showToast('⚠️ Bitte erst ein Event auswählen');
        return;
    }

    const e = plan.event;
    let text = `💕 Date-Plan:\n\n${e.emoji} ${e.title}\n📅 ${formatDate(e.date)}`;

    if (e.time) {
        text += ` • ${e.time}`;
    }

    if (plan.food !== 'nein' && e.restaurant) {
        text += `\n🍽️ ${e.restaurant.name} (${plan.food === 'vorher' ? 'vorher' : 'nachher'})`;
    }

    if (plan.drinks === 'ja' && e.bar) {
        text += `\n🍸 ${getBarName(e.bar)}`;
    }

    if (e.link) {
        text += `\n\n🎟️ ${e.link}`;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    showToast('📱 WhatsApp geöffnet!');
}

/**
 * Export date to calendar (.ics file)
 */
export function exportCalendar() {
    const plan = getPlan();
    if (!plan.event) {
        showToast('⚠️ Bitte erst ein Event auswählen');
        return;
    }

    const e = plan.event;
    const date = new Date(e.date);

    // Format date for ICS
    const dateStr = date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';

    // Build description
    let description = e.description || '';
    if (e.restaurant) {
        description += `\\n\\n🍽️ Restaurant: ${e.restaurant.name}`;
        if (e.restaurant.address) {
            description += `\\n${e.restaurant.address}`;
        }
    }
    if (e.bar) {
        description += `\\n🍸 Bar: ${getBarName(e.bar)}`;
    }

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Datebuch//DE',
        'BEGIN:VEVENT',
        `DTSTART:${dateStr}`,
        `SUMMARY:${e.emoji} ${e.title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${e.address || e.location || ''}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `date-${e.id}.ics`;
    a.click();

    URL.revokeObjectURL(url);
    showToast('📅 Kalender-Event erstellt!');
}

/**
 * Open transit route from work to first destination
 */
export function openTransitRoute() {
    const plan = getPlan();
    if (!plan.event) {
        showToast('⚠️ Bitte erst ein Event auswählen');
        return;
    }

    const e = plan.event;
    let firstDestination;

    // Determine first destination based on food timing
    if (plan.food === 'vorher' && e.restaurant) {
        firstDestination = e.restaurant.address || `${e.restaurant.name}, Hamburg`;
    } else {
        firstDestination = e.address || `${e.location}, Hamburg`;
    }

    // Use Google Maps with transit mode
    const mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(WORK_ADDRESS)}/${encodeURIComponent(firstDestination)}/?travelmode=transit`;

    window.open(mapsUrl, '_blank');
    showToast('🚇 Route geöffnet!');
}

// Make handlers available globally for HTML onclick
if (typeof window !== 'undefined') {
    window.shareToWhatsApp = shareWhatsApp;
    window.exportToCalendar = exportCalendar;
    window.openTransitRoute = openTransitRoute;
}
