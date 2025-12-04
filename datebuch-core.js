/**
 * Datebuch Core Module
 * Shared functionality between Classic (index.html) and Modern (datebuch-modern.html) versions
 *
 * Usage: Include this script in both HTML files, then call DatebuchCore.init()
 */

const DatebuchCore = (function() {
    'use strict';

    // ============ CONSTANTS ============
    const STORAGE_KEY = 'datebuch_data_v2';

    // ============ STATE ============
    let allEvents = [];
    let locationsDb = [];
    let currentEvent = null;
    let dateBuilderState = {
        event: null,
        restaurant: null,
        bars: [],
        wantFood: null,
        foodTiming: null
    };

    // ============ INITIALIZATION ============
    async function init(options = {}) {
        console.log('🚀 Datebuch Core initializing...');

        await loadEvents();
        await loadLocations();

        // Initialize features
        initPWA();
        initOfflineDetection();
        initCoupleSync();

        // Trigger ready callback
        if (options.onReady) {
            options.onReady(allEvents, locationsDb);
        }

        console.log(`✅ Datebuch Core ready - ${allEvents.length} events loaded`);
        return { events: allEvents, locations: locationsDb };
    }

    // ============ DATA LOADING ============
    async function loadEvents() {
        try {
            const response = await fetch('events.json');
            const data = await response.json();
            allEvents = data.events || [];
        } catch (err) {
            console.error('Events laden fehlgeschlagen:', err);
            allEvents = [];
        }
        return allEvents;
    }

    async function loadLocations() {
        try {
            const response = await fetch('locations-database.json');
            locationsDb = await response.json();
        } catch (err) {
            console.warn('Locations-DB nicht gefunden');
            locationsDb = [];
        }
        return locationsDb;
    }

    // ============ STORAGE ============
    function getSaved() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    }

    function saveSaved(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function updateSaved(updates) {
        const saved = getSaved();
        Object.assign(saved, updates);
        saveSaved(saved);
        return saved;
    }

    // ============ EVENT HELPERS ============
    function isPastEvent(event) {
        if (!event.date || event.date === 'dauerhaft') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (event.endDate) {
            const endDate = new Date(event.endDate);
            endDate.setHours(0, 0, 0, 0);
            return endDate < today;
        }

        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
    }

    function getActiveEvents(ratings = null) {
        if (!ratings) {
            ratings = getSaved().ratings || {};
        }
        return allEvents.filter(e => !isPastEvent(e) && !ratings[e.id]?.disliked);
    }

    function getCountdown(dateStr) {
        if (!dateStr || dateStr === 'dauerhaft') return null;
        const eventDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);

        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: 'Vorbei', class: 'past', days: diffDays };
        if (diffDays === 0) return { text: 'Heute! 🎉', class: 'today', days: 0 };
        if (diffDays === 1) return { text: 'Morgen!', class: 'soon', days: 1 };
        if (diffDays <= 7) return { text: `In ${diffDays} Tagen`, class: 'soon', days: diffDays };
        if (diffDays <= 30) return { text: `In ${diffDays} Tagen`, class: 'upcoming', days: diffDays };
        return { text: `${diffDays} Tage`, class: 'future', days: diffDays };
    }

    function getCategoryName(category) {
        const names = {
            shows: 'Shows & Konzerte',
            musical: 'Musical',
            variete: 'Varieté',
            theater: 'Theater',
            musik: 'Musik',
            comedy: 'Comedy',
            wellness: 'Wellness',
            aktiv: 'Aktiv',
            handwerk: 'Handwerk',
            essen: 'Essen'
        };
        return names[category] || category;
    }

    function getCategoryEmoji(category) {
        const emojis = {
            shows: '🎭',
            musical: '🎭',
            variete: '🎪',
            theater: '🎬',
            musik: '🎵',
            comedy: '😂',
            wellness: '💆',
            aktiv: '🏃',
            handwerk: '🔨',
            essen: '🍽️'
        };
        return emojis[category] || '📅';
    }

    // ============ RATINGS ============
    function rateEvent(eventId, liked) {
        const saved = getSaved();
        saved.ratings = saved.ratings || {};
        saved.ratings[eventId] = saved.ratings[eventId] || {};

        if (liked) {
            saved.ratings[eventId].liked = true;
            saved.ratings[eventId].disliked = false;
        } else {
            saved.ratings[eventId].liked = false;
            saved.ratings[eventId].disliked = true;
        }

        saveSaved(saved);

        // Sync if enabled
        syncRating(eventId, liked ? 'liked' : 'disliked');

        return saved.ratings[eventId];
    }

    function toggleLike(eventId) {
        const saved = getSaved();
        saved.ratings = saved.ratings || {};
        saved.ratings[eventId] = saved.ratings[eventId] || {};
        saved.ratings[eventId].liked = !saved.ratings[eventId].liked;
        if (saved.ratings[eventId].liked) {
            saved.ratings[eventId].disliked = false;
        }
        saveSaved(saved);
        return saved.ratings[eventId].liked;
    }

    // ============ SMART RECOMMENDATIONS ============
    function getSmartRecommendations(limit = 3) {
        const saved = getSaved();
        const ratings = saved.ratings || {};
        const dateHistory = saved.dateHistory || [];

        const likedEvents = allEvents.filter(e => ratings[e.id]?.liked);
        const likedCategories = {};
        likedEvents.forEach(e => {
            likedCategories[e.category] = (likedCategories[e.category] || 0) + 1;
        });

        const now = new Date();
        const hour = now.getHours();
        const isEvening = hour >= 17;
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;

        const scoredEvents = getActiveEvents(ratings)
            .filter(e => !ratings[e.id]?.liked) // Show new stuff
            .map(e => {
                let score = 0;
                let reasons = [];

                if (likedCategories[e.category]) {
                    score += likedCategories[e.category] * 10;
                    reasons.push(`Ihr mögt ${getCategoryName(e.category)}`);
                }

                if (isEvening && ['essen', 'shows', 'comedy'].includes(e.category)) {
                    score += 15;
                    reasons.push('Perfekt für heute Abend');
                }

                if (isWeekend && ['aktiv', 'wellness', 'handwerk'].includes(e.category)) {
                    score += 10;
                    reasons.push('Ideal fürs Wochenende');
                }

                const recentCategories = dateHistory.slice(-5).map(d => d.category);
                if (!recentCategories.includes(e.category)) {
                    score += 8;
                    reasons.push('Mal was Neues!');
                }

                const countdown = getCountdown(e.date);
                if (countdown?.class === 'soon') score += 12;
                if (countdown?.class === 'today') score += 25;

                score += Math.random() * 5;

                return { ...e, score, reason: reasons[0] || 'Für euch ausgewählt' };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return scoredEvents;
    }

    // ============ DATE BUILDER ============
    function startDateBuilder(eventId) {
        const event = allEvents.find(e => e.id === eventId);
        if (!event) return null;

        dateBuilderState = {
            event: event,
            restaurant: null,
            bars: [],
            wantFood: null,
            foodTiming: null
        };

        return dateBuilderState;
    }

    function setRestaurant(restaurant, timing) {
        dateBuilderState.restaurant = restaurant;
        dateBuilderState.foodTiming = timing;
        return dateBuilderState;
    }

    function addBar(bar) {
        if (!dateBuilderState.bars.includes(bar)) {
            dateBuilderState.bars.push(bar);
        }
        return dateBuilderState;
    }

    function removeBar(bar) {
        dateBuilderState.bars = dateBuilderState.bars.filter(b => b !== bar);
        return dateBuilderState;
    }

    function calculateDateBudget() {
        const { event, restaurant, bars } = dateBuilderState;
        let activityMin = 0, activityMax = 0;
        let foodMin = 0, foodMax = 0;
        let drinksMin = 0, drinksMax = 0;

        // Activity cost
        if (event?.price) {
            const priceStr = event.price.replace(/[^0-9-]/g, '');
            const prices = priceStr.split('-').map(p => parseInt(p) || 0);
            activityMin = prices[0] * 2; // For 2 people
            activityMax = (prices[1] || prices[0]) * 2;
        }

        // Food cost
        if (restaurant) {
            foodMin = 40; // ~20€ per person
            foodMax = 80;
        }

        // Drinks cost
        if (bars.length > 0) {
            drinksMin = bars.length * 20; // ~10€ per person per bar
            drinksMax = bars.length * 40;
        }

        return {
            activity: Math.round((activityMin + activityMax) / 2),
            food: Math.round((foodMin + foodMax) / 2),
            drinks: Math.round((drinksMin + drinksMax) / 2),
            min: activityMin + foodMin + drinksMin,
            max: activityMax + foodMax + drinksMax
        };
    }

    function getDateBuilderSummary() {
        const budget = calculateDateBudget();
        return {
            ...dateBuilderState,
            budget
        };
    }

    // ============ POST-DATE RATING ============
    function savePostDateRating(eventId, rating, notes = '') {
        const saved = getSaved();
        saved.dateHistory = saved.dateHistory || [];

        const event = allEvents.find(e => e.id === eventId);
        saved.dateHistory.push({
            eventId,
            title: event?.title || 'Date',
            emoji: event?.emoji || '💕',
            category: event?.category,
            date: new Date().toISOString(),
            rating,
            notes
        });

        saveSaved(saved);
        checkAchievements();

        return saved.dateHistory;
    }

    // ============ LOVE LETTERS ============
    function sendLoveLetter(text, from = 'Nick') {
        const saved = getSaved();
        saved.loveLetters = saved.loveLetters || [];
        saved.loveLetters.push({
            date: new Date().toISOString(),
            text,
            from
        });
        saveSaved(saved);
        return saved.loveLetters;
    }

    function getLoveLetters() {
        return getSaved().loveLetters || [];
    }

    // ============ ACHIEVEMENTS ============
    function checkAchievements() {
        const saved = getSaved();
        const dateHistory = saved.dateHistory || [];
        const unlockedAchievements = saved.unlockedAchievements || [];
        const newAchievements = [];

        const achievements = [
            { id: 'first_rated', emoji: '⭐', title: 'Erstes bewertetes Date!', desc: 'Ihr habt euer erstes Date bewertet.', check: () => dateHistory.length >= 1 },
            { id: 'five_dates', emoji: '🎉', title: '5 Dates!', desc: 'Ihr habt schon 5 Dates zusammen erlebt!', check: () => dateHistory.length >= 5 },
            { id: 'ten_dates', emoji: '🏆', title: '10 Dates!', desc: 'Ihr seid echte Date-Profis!', check: () => dateHistory.length >= 10 },
            { id: 'perfect_date', emoji: '💯', title: 'Perfektes Date!', desc: 'Ein Date mit 5 Herzen!', check: () => dateHistory.some(d => d.rating === 5) },
            { id: 'variety', emoji: '🌈', title: 'Variety Kings', desc: '5 verschiedene Kategorien ausprobiert!', check: () => new Set(dateHistory.map(d => d.category)).size >= 5 },
            { id: 'love_letter', emoji: '💌', title: 'Liebesbrief', desc: 'Einen Liebesbrief geschrieben!', check: () => (saved.loveLetters || []).length >= 1 },
        ];

        achievements.forEach(a => {
            if (!unlockedAchievements.includes(a.id) && a.check()) {
                unlockedAchievements.push(a.id);
                newAchievements.push(a);
            }
        });

        if (newAchievements.length > 0) {
            saved.unlockedAchievements = unlockedAchievements;
            saveSaved(saved);
        }

        return newAchievements;
    }

    function getAchievements() {
        const saved = getSaved();
        return saved.unlockedAchievements || [];
    }

    // ============ BUCKET LIST ============
    const defaultBucketItems = [
        { id: 'b1', emoji: '🌋', text: 'Vulkan besteigen', completed: false },
        { id: 'b2', emoji: '🎿', text: 'Zusammen Skifahren lernen', completed: false },
        { id: 'b3', emoji: '🏕️', text: 'Unter freiem Himmel schlafen', completed: false },
        { id: 'b4', emoji: '🎭', text: '10 verschiedene Musicals sehen', completed: false },
        { id: 'b5', emoji: '🍳', text: 'Zusammen einen Kochkurs machen', completed: false },
        { id: 'b6', emoji: '🏃', text: 'Marathon zusammen laufen', completed: false },
        { id: 'b7', emoji: '🎨', text: 'Gemeinsam ein Bild malen', completed: false },
        { id: 'b8', emoji: '🚂', text: 'Interrail durch Europa', completed: false },
        { id: 'b9', emoji: '🤿', text: 'Tauchen gehen', completed: false },
        { id: 'b10', emoji: '🎪', text: 'Zu einem Festival fahren', completed: false },
    ];

    function getBucketList() {
        const saved = getSaved();
        return saved.bucketList || [...defaultBucketItems];
    }

    function saveBucketList(items) {
        updateSaved({ bucketList: items });
    }

    function toggleBucketItem(itemId) {
        const items = getBucketList();
        const item = items.find(i => i.id === itemId);
        if (item) {
            item.completed = !item.completed;
            saveBucketList(items);
        }
        return items;
    }

    function addBucketItem(emoji, text) {
        const items = getBucketList();
        items.push({
            id: 'b_' + Date.now(),
            emoji,
            text,
            completed: false
        });
        saveBucketList(items);
        return items;
    }

    function deleteBucketItem(itemId) {
        const items = getBucketList().filter(i => i.id !== itemId);
        saveBucketList(items);
        return items;
    }

    // ============ BUDGET TRACKER ============
    function getBudget() {
        const saved = getSaved();
        return saved.budget || { monthlyBudget: 500, expenses: [] };
    }

    function saveBudget(budget) {
        updateSaved({ budget });
    }

    function addExpense(amount, category, description) {
        const budget = getBudget();
        budget.expenses = budget.expenses || [];
        budget.expenses.push({
            id: 'exp_' + Date.now(),
            amount,
            category,
            description,
            date: new Date().toISOString()
        });
        saveBudget(budget);
        return budget;
    }

    function setMonthlyBudget(amount) {
        const budget = getBudget();
        budget.monthlyBudget = amount;
        saveBudget(budget);
        return budget;
    }

    function getCurrentMonthExpenses() {
        const budget = getBudget();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return (budget.expenses || []).filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    }

    // ============ COUPLE SYNC (Demo) ============
    let syncEnabled = false;
    let syncHeartbeatInterval = null;

    function initCoupleSync() {
        const saved = getSaved();
        if (saved.coupleSyncEnabled) {
            syncEnabled = true;
            startSyncHeartbeat();
        }
    }

    function enableCoupleSync() {
        updateSaved({
            coupleSyncEnabled: true,
            coupleId: 'nick_solli_' + Date.now()
        });
        syncEnabled = true;
        startSyncHeartbeat();
        return true;
    }

    function disableCoupleSync() {
        updateSaved({ coupleSyncEnabled: false });
        syncEnabled = false;
        if (syncHeartbeatInterval) {
            clearInterval(syncHeartbeatInterval);
        }
        return false;
    }

    function startSyncHeartbeat() {
        if (syncHeartbeatInterval) return;

        syncHeartbeatInterval = setInterval(() => {
            // Emit sync event for UI to handle
            window.dispatchEvent(new CustomEvent('datebuch:sync', {
                detail: {
                    partnerOnline: Math.random() > 0.3,
                    lastSeen: new Date().toISOString()
                }
            }));
        }, 10000);
    }

    function syncRating(eventId, rating) {
        if (!syncEnabled) return;
        console.log('🔄 Syncing rating:', eventId, rating);

        // Emit sync event
        if (Math.random() > 0.7) {
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('datebuch:partnerRated', {
                    detail: { eventId, rating, partner: 'Solli' }
                }));
            }, 1500);
        }
    }

    // ============ PWA & OFFLINE ============
    let deferredPrompt = null;

    function initPWA() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            setTimeout(() => {
                const saved = getSaved();
                if (!saved.pwaDismissed) {
                    window.dispatchEvent(new CustomEvent('datebuch:installPrompt'));
                }
            }, 3000);
        });

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => {
                    console.log('✅ Service Worker registriert');

                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                window.dispatchEvent(new CustomEvent('datebuch:updateAvailable'));
                            }
                        });
                    });
                })
                .catch(err => console.log('SW Fehler:', err));
        }
    }

    function installPWA() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((result) => {
                deferredPrompt = null;
                return result.outcome === 'accepted';
            });
        }
        return false;
    }

    function dismissPWAPrompt() {
        updateSaved({ pwaDismissed: true });
        deferredPrompt = null;
    }

    function initOfflineDetection() {
        function updateStatus() {
            window.dispatchEvent(new CustomEvent('datebuch:onlineStatus', {
                detail: { online: navigator.onLine }
            }));
        }

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
    }

    // ============ MYSTERY DATE ============
    function getRandomDate() {
        const saved = getSaved();
        const ratings = saved.ratings || {};
        const candidates = getActiveEvents(ratings);

        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // ============ DATA EXPORT/IMPORT ============
    function exportData() {
        const saved = getSaved();
        return {
            version: 2,
            exportDate: new Date().toISOString(),
            data: saved
        };
    }

    function importData(data) {
        if (data.version && data.data) {
            saveSaved(data.data);
        } else {
            saveSaved(data);
        }
        return getSaved();
    }

    // ============ YEAR REVIEW ============
    function getYearReview() {
        const saved = getSaved();
        const dateHistory = saved.dateHistory || [];
        const ratings = saved.ratings || {};

        const totalDates = dateHistory.length;
        const avgRating = totalDates > 0
            ? (dateHistory.reduce((sum, d) => sum + (d.rating || 0), 0) / totalDates).toFixed(1)
            : 0;

        const categoryCount = {};
        dateHistory.forEach(d => {
            categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
        });

        const topCategory = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])[0];

        const likedCount = Object.values(ratings).filter(r => r.liked).length;
        const perfectDates = dateHistory.filter(d => d.rating === 5).length;

        return {
            totalDates,
            avgRating,
            topCategory: topCategory ? { name: getCategoryName(topCategory[0]), count: topCategory[1] } : null,
            likedCount,
            perfectDates,
            bucketCompleted: getBucketList().filter(i => i.completed).length
        };
    }

    // ============ ÖPNV ROUTE ============
    function openTransitConnection(destination) {
        // Sollis Arbeit als Start
        const start = 'Stadtdeich 5, 20097 Hamburg';
        const dest = encodeURIComponent(destination);
        const url = `https://www.google.com/maps/dir/${encodeURIComponent(start)}/${dest}/?travelmode=transit`;
        window.open(url, '_blank');
    }

    // ============ PUBLIC API ============
    return {
        // Initialization
        init,

        // Data
        getEvents: () => allEvents,
        getLocations: () => locationsDb,
        getSaved,
        saveSaved,
        updateSaved,

        // Events
        isPastEvent,
        getActiveEvents,
        getCountdown,
        getCategoryName,
        getCategoryEmoji,

        // Ratings
        rateEvent,
        toggleLike,

        // Recommendations
        getSmartRecommendations,
        getRandomDate,

        // Date Builder
        startDateBuilder,
        setRestaurant,
        addBar,
        removeBar,
        calculateDateBudget,
        getDateBuilderSummary,
        getDateBuilderState: () => dateBuilderState,

        // Post-Date
        savePostDateRating,

        // Love Letters
        sendLoveLetter,
        getLoveLetters,

        // Achievements
        checkAchievements,
        getAchievements,

        // Bucket List
        getBucketList,
        saveBucketList,
        toggleBucketItem,
        addBucketItem,
        deleteBucketItem,

        // Budget
        getBudget,
        saveBudget,
        addExpense,
        setMonthlyBudget,
        getCurrentMonthExpenses,

        // Couple Sync
        enableCoupleSync,
        disableCoupleSync,
        isSyncEnabled: () => syncEnabled,

        // PWA
        installPWA,
        dismissPWAPrompt,

        // Data Management
        exportData,
        importData,

        // Year Review
        getYearReview,

        // Navigation
        openTransitConnection
    };
})();

// Export for ES modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DatebuchCore;
}
