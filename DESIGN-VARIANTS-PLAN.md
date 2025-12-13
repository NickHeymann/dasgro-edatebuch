# Das große Datebuch - Design Variants ULTRATHINK Plan
**Datum:** 2025-12-12
**Status:** 🔵 Planning Phase
**Goal:** 3-4 komplett unterschiedliche Design-Varianten mit eigenem UX-Ansatz

---

## 🎯 Research Summary

### Top App UI Patterns 2025

**Dating Apps (Tinder/Bumble/Hinge):**
- Card-based swipe interface (rapid engagement)
- Minimal, photo-focused UI
- Bottom navigation (thumb-friendly)
- Personalized profiles with prompts
- **Key Insight:** Hinge is "gold standard" for personal engagement

**Event Discovery (Eventbrite/Fever):**
- Dynamic card-based interface
- Curated lists (2x ticket conversion)
- "Spotify for events" approach
- Trending topics + community hubs
- **Key Insight:** Discovery should be intuitive, not utilitarian

**Travel Planning (TripIt/Airbnb):**
- Timeline/itinerary view
- Seamless integration with booking
- Map-centric navigation
- **Key Insight:** TripIt UI feels dated (2008 vibes), room for modernization

**Couple Apps (Cupla/DuoDo/ClanPlan):**
- Shared calendar focus
- Collaborative task management
- Color-coded planning
- Minimalist, ad-free
- **Key Insight:** Clean, private, all-in-one hub

**Mobile UI Trends 2025:**
- ✅ Bottom sheets (pull-up gestures)
- ✅ Gesture navigation (21% faster than top nav)
- ✅ Card-based design (content consumption)
- ✅ Bottom navigation bars (ergonomic, thumb-friendly)
- ✅ Swipe gestures (intuitive, reduces button clutter)

### Sources
- [Purrweb: Dating App UI/UX Tips](https://www.purrweb.com/blog/tips-to-create-a-successful-dating-app-ui-and-ux/)
- [Medium: Best Dating App Practices 2025](https://medium.com/@prajapatisuketu/best-dating-app-ui-ux-design-practices-in-2025-d38fac4fa9c6)
- [Instrument: Eventbrite Redesign](https://www.instrument.com/work/eventbrite-app)
- [Fast Company: Eventbrite as Spotify of Events](https://www.fastcompany.com/91289655/eventbrite-app-redesign-event-discovery)
- [A3Logics: Best Travel Apps 2025](https://www.a3logics.com/blog/best-apps-for-planning-travel/)
- [Cupla: Best Couple Apps](https://cupla.app/blog/10-best-apps-for-couples-in-2024/)
- [Chop Dawg: Mobile UI Trends 2025](https://www.chopdawg.com/ui-ux-design-trends-in-mobile-apps-for-2025/)
- [SPDLoad: 16 Key Mobile Trends](https://spdload.com/blog/mobile-app-ui-ux-design-trends/)

---

## 🚀 Proposed Design Variants

### ❄️ ORIGINAL: Winter Scene (index.html)
**Keep as Main Version - 100% Preserved**
- Romantic, playful, glassmorphism
- Book animation, hamster cursor, snowman
- Monolithic HTML (6521 lines)
- **URL:** `/` (root)

---

### 🃏 VARIANT 1: "Swipe Mode" (Dating-App-Inspired)
**Tagline:** "Swipe right for your next date"

#### Design Philosophy
- Tinder/Bumble card-based swipe mechanic
- **Focus:** Rapid decision-making, playful engagement
- **Target:** Quick browsing, low-commitment exploration

#### UI Architecture
```
┌─────────────────────────────────┐
│  Header: Logo + Profile         │ ← Fixed top bar
├─────────────────────────────────┤
│                                 │
│   ┌─────────────────────────┐   │
│   │   EVENT CARD (Front)    │   │
│   │   🎭 Musical Title      │   │ ← Swipeable card stack
│   │   📅 Dec 15, 2025       │   │
│   │   📍 Hamburg            │   │
│   │   [Large Photo]         │   │
│   └─────────────────────────┘   │
│                                 │
│   👈 Skip     Details   Like 👉 │ ← Action buttons
│                                 │
├─────────────────────────────────┤
│ ❤️ 🗓️ 🌍 💬 👤              │ ← Bottom nav (5 tabs)
└─────────────────────────────────┘
```

#### Key Features
1. **Card Stack:** Events as cards (TinderJS library)
   - Swipe left = Skip
   - Swipe right = Like (add to "My Dates")
   - Tap card = Expand bottom sheet with full details

2. **Bottom Sheet:** Event details slide up
   - Restaurant + Bar suggestions
   - "Add to Calendar" button
   - "Build Date" quick action
   - Dismiss with swipe down

3. **Bottom Navigation (5 Tabs):**
   - ❤️ Discover (swipe mode)
   - 🗓️ Saved Dates
   - 🌍 Travel
   - 💬 Messages (couple chat)
   - 👤 Profile

4. **Filters:** Floating chip filters (top of card stack)
   - Category tags (swipe horizontal scroll)
   - Date range picker

#### Tech Stack
- **Framework:** Vanilla JS + [Hammer.js](https://hammerjs.github.io/) for gestures
- **Card Library:** [Swing](https://github.com/gajus/swing) or custom CSS transforms
- **Bottom Sheet:** [Bottom Sheet Library](https://github.com/webpro/reveal-modal) or custom
- **Architecture:** Modular (app.js, swipe.js, bottom-sheet.js, nav.js)
- **File Size:** ~500 lines total (4 modules @ 125 lines each)

#### Design Tokens
```css
/* Swipe Mode Theme */
:root {
  --primary: #ff6b6b; /* Tinder red */
  --secondary: #4ecdc4; /* Teal accent */
  --background: #ffffff;
  --card-shadow: 0 10px 30px rgba(0,0,0,0.1);
  --font-primary: 'Inter', sans-serif;
}
```

#### Data Flow
```
events.json → shuffle() → Card Stack (max 20 cards loaded)
  ↓
Swipe Right → localStorage.myDates.push(event)
  ↓
Bottom Sheet → dateBuilder.build(event)
```

#### Unique Features
- 🎯 **Quick Match:** AI suggests best events based on swipe history
- 🔥 **Streak Counter:** "5 dates planned this month!"
- 💬 **Couple Sync:** See partner's swipes in real-time (if enabled)

---

### 📅 VARIANT 2: "Timeline Mode" (Travel-Planner-Inspired)
**Tagline:** "Your dates, beautifully organized"

#### Design Philosophy
- TripIt/Google Calendar timeline aesthetic
- **Focus:** Planning, organization, itinerary-building
- **Target:** Structured planners, detail-oriented users

#### UI Architecture
```
┌─────────────────────────────────┐
│  Dec 2025  ▼  |  Filters        │ ← Month picker + filters
├─────────────────────────────────┤
│ Week View                       │ ← Horizontal week scroll
│ Mo Tu We Th Fr Sa Su            │
│  9 10 11 12 13 14 15            │
├─────────────────────────────────┤
│ Timeline                        │
│ ┌─────────────────────────────┐ │
│ │ 18:00 - 22:00               │ │ ← Event blocks
│ │ 🎭 Musical "Hamilton"       │ │ (drag-and-drop)
│ │ 📍 Stage Theater            │ │
│ │ 🍝 Vapiano (before)         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 19:30 - 23:00               │ │
│ │ 🎸 Konzert "Bon Iver"       │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ + Add Event  |  📊 Stats        │ ← Footer actions
└─────────────────────────────────┘
```

#### Key Features
1. **Week View:** Horizontal scroll week selector
   - Today highlighted
   - Swipe left/right for prev/next week

2. **Timeline Blocks:** Vertical day timeline
   - Events as time blocks (like Google Calendar)
   - Drag-and-drop to reschedule
   - Color-coded by category
   - Tap block → Detail modal

3. **Drag-and-Drop Date Builder:**
   - Drag event to timeline
   - Drag restaurant into event block
   - Drag bar into event block
   - Auto-calculate budget + timing

4. **Month Overview:** Calendar grid view (alternative)
   - Dots for events per day
   - Tap day → Timeline view

5. **Stats Dashboard:**
   - "3 dates this month"
   - "Budget: €250 / €400"
   - "Most visited: Elbphilharmonie"

#### Tech Stack
- **Framework:** Vanilla JS + [FullCalendar](https://fullcalendar.io/) (timeline plugin)
- **Drag-and-Drop:** [SortableJS](https://sortablejs.github.io/Sortable/)
- **Date Handling:** [date-fns](https://date-fns.org/)
- **Architecture:** Modular (timeline.js, calendar.js, drag-drop.js, stats.js)
- **File Size:** ~700 lines total (5 modules @ 140 lines each)

#### Design Tokens
```css
/* Timeline Mode Theme */
:root {
  --primary: #5865f2; /* Discord blue */
  --secondary: #57f287; /* Green accent */
  --background: #f6f7f9;
  --timeline-grid: #e3e5e8;
  --font-primary: 'DM Sans', sans-serif;
}
```

#### Data Flow
```
events.json → groupByDate() → Timeline Blocks
  ↓
Drag Event → dateBuilder.addActivity(event, time)
  ↓
Save → localStorage.itinerary.push({event, restaurant, bar, time})
```

#### Unique Features
- 🔄 **Auto-Schedule:** AI suggests optimal time slots
- 📊 **Analytics:** "You prefer Fridays at 20:00"
- 🚇 **ÖPNV Integration:** Travel time between events
- 📤 **Export:** .ics + PDF itinerary

---

### 📰 VARIANT 3: "Feed Mode" (Eventbrite-Discovery-Inspired)
**Tagline:** "Discover dates like discovering music"

#### Design Philosophy
- Eventbrite/Spotify infinite scroll feed
- **Focus:** Serendipitous discovery, curated recommendations
- **Target:** Explorers, spontaneous planners

#### UI Architecture
```
┌─────────────────────────────────┐
│  🔍 Search Hamburg dates...     │ ← Search bar (sticky)
├─────────────────────────────────┤
│ Filter: 🎭 Musical  ✕           │ ← Horizontal chip scroll
│         🍝 Restaurant ✕         │
├─────────────────────────────────┤
│ 🔥 Trending This Week           │ ← Curated section header
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│ │[1]│ │[2]│ │[3]│ │[4]│         │ ← Horizontal scroll cards
│ └───┘ └───┘ └───┘ └───┘         │
├─────────────────────────────────┤
│ 🎯 For You                      │
│ ┌─────────────────────────────┐ │
│ │ [Event Card - Large]        │ │ ← Vertical scroll
│ │ Musical "Frozen"            │ │
│ │ 🌟 4.8 (2.3k reviews)       │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ [Event Card - Large]        │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 💡 New Events                   │
│ ┌───┐ ┌───┐ ┌───┐               │
│ └───┘ └───┘ └───┘               │
└─────────────────────────────────┘
```

#### Key Features
1. **Curated Sections:**
   - 🔥 Trending This Week
   - 🎯 For You (AI-personalized)
   - 💡 New Events
   - 🏆 Top Rated
   - 📍 Near You

2. **Infinite Scroll:**
   - Lazy loading (load 10 events at a time)
   - Skeleton loaders while loading

3. **Smart Filters:**
   - Horizontal chip scroll (sticky below search)
   - Multi-select categories
   - Date range slider
   - Price range slider

4. **Event Cards (Large):**
   - Hero image (2:1 aspect ratio)
   - Title + Category + Date
   - Rating stars + review count
   - "Quick Add" heart icon (top right)
   - Tap card → Detail page (full screen)

5. **Detail Page:** Full-screen modal
   - Cover photo
   - Title + Meta (date, location, price)
   - Description
   - Restaurant + Bar suggestions (carousel)
   - "Build Date" CTA button
   - Reviews section

#### Tech Stack
- **Framework:** Vanilla JS + [Alpine.js](https://alpinejs.dev/) (lightweight reactivity)
- **Infinite Scroll:** [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- **Search:** [Fuse.js](https://fusejs.io/) (fuzzy search)
- **Architecture:** Modular (feed.js, search.js, filters.js, detail.js)
- **File Size:** ~600 lines total (4 modules @ 150 lines each)

#### Design Tokens
```css
/* Feed Mode Theme */
:root {
  --primary: #1db954; /* Spotify green */
  --secondary: #191414; /* Spotify black */
  --background: #ffffff;
  --card-radius: 12px;
  --font-primary: 'Circular', -apple-system, sans-serif;
}
```

#### Data Flow
```
events.json → curatedSections() → Feed Sections
  ↓
Scroll → loadMore() → Append events
  ↓
Tap Card → openDetail(event) → Bottom sheet or full page
```

#### Unique Features
- 🎵 **Spotify-Style:** Curated playlists like "Cozy Winter Dates"
- 🔔 **Smart Notifications:** "New event matching your taste"
- 👥 **Social Proof:** "3 friends liked this"
- 🎁 **Surprise Me:** Random date generator

---

### 📱 VARIANT 4: "Dashboard Mode" (Couple-App-Inspired)
**Tagline:** "Your shared date space"

#### Design Philosophy
- Cupla/Notion widget-based dashboard
- **Focus:** Collaboration, shared planning, all-in-one hub
- **Target:** Couples who love organization

#### UI Architecture
```
┌─────────────────────────────────┐
│  Nick & Solli's Datebuch ❤️     │ ← Header with couple names
│  Dec 12, 2025                   │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 📅 UPCOMING DATES           │ │ ← Widget: Next 3 dates
│ │ Tomorrow: Musical "Frozen"  │ │
│ │ Dec 20: Wellness Spa        │ │
│ └─────────────────────────────┘ │
│ ┌──────────┐ ┌────────────────┐ │
│ │ 💰 Budget│ │ 🎯 Bucket List │ │ ← 2-column widgets
│ │ €150/€400│ │ 3/12 done      │ │
│ └──────────┘ └────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 📸 MEMORIES (Last 6 Photos) │ │ ← Widget: Photo grid
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 🔥 DISCOVER (Recommendations)│ │ ← Widget: Event carousel
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ ➕ Add Widget                   │ ← Add new widgets
└─────────────────────────────────┘
```

#### Key Features
1. **Widget System:** Drag-and-drop customizable widgets
   - 📅 Upcoming Dates
   - 💰 Budget Tracker
   - 🎯 Bucket List
   - 📸 Memories
   - 🔥 Discover Events
   - 🗺️ Travel Map
   - ❤️ Love Letters
   - 📊 Year in Review

2. **Widget Sizes:**
   - Small (1x1): Budget, Countdown
   - Medium (2x1): Upcoming Dates, Bucket List
   - Large (2x2): Memories, Map

3. **Shared Space:**
   - Color-coded: Nick (blue) / Solli (pink)
   - Activity feed: "Nick added a date"
   - Reactions: 👍 ❤️ 🎉

4. **Quick Actions:** Floating action button (FAB)
   - + Add Date
   - + Add Memory
   - + Add Expense

5. **Customization:**
   - Reorder widgets (drag-and-drop)
   - Hide/show widgets
   - Change widget size

#### Tech Stack
- **Framework:** Vanilla JS + [Muuri](https://muuri.dev/) (grid layout)
- **Drag-and-Drop:** [Muuri](https://muuri.dev/) (built-in)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) or localStorage
- **Architecture:** Modular (dashboard.js, widgets/*.js, shared-state.js)
- **File Size:** ~800 lines total (dashboard 200, 6 widgets @ 100 each)

#### Design Tokens
```css
/* Dashboard Mode Theme */
:root {
  --primary: #a78bfa; /* Purple */
  --secondary: #f472b6; /* Pink */
  --background: #fafafa;
  --widget-bg: #ffffff;
  --widget-shadow: 0 2px 8px rgba(0,0,0,0.08);
  --font-primary: 'Plus Jakarta Sans', sans-serif;
}
```

#### Data Flow
```
localStorage.widgets → renderDashboard()
  ↓
Widget Config: { id, type, position, size, data }
  ↓
Drag-and-Drop → saveWidgetLayout()
```

#### Unique Features
- 🔄 **Real-Time Sync:** Changes appear on partner's device
- 🎨 **Themes:** Light/Dark + custom color schemes
- 📱 **PWA:** Install as app, offline-first
- 🔔 **Shared Notifications:** "Solli completed a bucket list item!"

---

## 🏗️ Implementation Strategy

### Phase 1: Core Architecture (Days 1-2)
1. Update `FEATURES.md` with current state
2. Create base structure for variants:
   ```
   /variants/
   ├── swipe/
   │   ├── index.html
   │   ├── app.js
   │   ├── swipe.js
   │   └── README.md
   ├── timeline/
   ├── feed/
   └── dashboard/
   ```
3. Setup shared resources:
   ```
   /shared/
   ├── events.json (symlink or copy)
   ├── locations-database.json
   ├── utils.js (common functions)
   └── styles-base.css (reset, typography)
   ```

### Phase 2: Swipe Mode MVP (Days 3-5)
1. Card stack with swipe gestures
2. Bottom sheet for details
3. Bottom navigation (5 tabs)
4. localStorage for liked events

### Phase 3: Timeline Mode MVP (Days 6-8)
1. Week view + timeline grid
2. Drag-and-drop date builder
3. Calendar export (.ics)

### Phase 4: Feed Mode MVP (Days 9-11)
1. Curated sections
2. Infinite scroll
3. Search + filters
4. Detail page

### Phase 5: Dashboard Mode MVP (Days 12-14)
1. Widget system (3 widgets)
2. Drag-and-drop layout
3. Shared state (localStorage)

### Phase 6: Polish & Deploy (Days 15-17)
1. Responsive design (all variants)
2. Dark mode (all variants)
3. PWA setup
4. Hetzner deployment
5. User testing + feedback

---

## 📏 Technical Constraints

### CLAUDE.md Compliance
- ✅ Each variant = separate directory (modular)
- ✅ Each module < 300 lines
- ✅ Feature branches for each variant
- ✅ Snapshot tags before major changes
- ✅ No changes to original `/index.html`

### File Size Budget
| Variant | Total Lines | Modules | Max Module Size |
|---------|-------------|---------|----------------|
| Swipe | ~500 | 4 | 125 lines |
| Timeline | ~700 | 5 | 140 lines |
| Feed | ~600 | 4 | 150 lines |
| Dashboard | ~800 | 7 | 115 lines |

### Performance Budget
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

### Browser Support
- Chrome/Edge: Last 2 versions
- Safari: Last 2 versions
- Firefox: Last 2 versions
- Mobile: iOS 14+, Android 10+

---

## 🎨 Design System

### Shared Components (All Variants)
- Event Card (base styles)
- Modal/Bottom Sheet
- Button (primary, secondary, icon)
- Input (text, select, date picker)
- Loading States (skeleton, spinner)

### Typography Scale
```css
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
```

### Spacing Scale
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

---

## 🧪 Testing Strategy

### Unit Tests
- Event filtering/sorting logic
- Date builder calculations
- localStorage persistence

### Integration Tests
- Swipe gestures work
- Drag-and-drop saves correctly
- Infinite scroll loads more

### User Testing
- 5 users per variant
- Task completion rate
- Time on task
- Subjective preference survey

---

## 📊 Success Metrics

### Engagement
- Daily Active Users (DAU)
- Session Duration
- Events Liked/Saved

### Conversion
- Date Builder Completions
- Calendar Exports
- WhatsApp Shares

### Retention
- 7-Day Retention Rate
- 30-Day Retention Rate

### Preference
- User Survey: Favorite Variant
- Heatmap: Most-Used Features

---

## 🚧 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Too many variants confuse users | Medium | High | User testing + clear onboarding |
| Maintenance overhead (4 codebases) | High | Medium | Extract shared components |
| Performance issues on mobile | Low | High | Performance budget + lazy loading |
| Feature parity hard to maintain | Medium | Medium | Shared `events.json` + feature flags |

---

## 📝 Next Steps (Awaiting Approval)

1. **User Approval:**
   - Review this plan
   - Choose which variants to build (1-4)
   - Prioritize order

2. **Setup:**
   - Create `/variants/` structure
   - Update `FEATURES.md`
   - Create feature branch: `feature/design-variants`

3. **Build:**
   - Start with Variant 1 (Swipe Mode)
   - Iterate with user feedback
   - Deploy to Hetzner for testing

---

**Status:** 🟡 Awaiting Nick's Approval
**Estimated Timeline:** 17 days (if all 4 variants)
**Estimated Timeline:** 5 days (if 1 variant MVP)
