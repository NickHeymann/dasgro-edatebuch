-- =============================================
-- DATEBUCH DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emoji TEXT,
    title TEXT NOT NULL,
    date TEXT,
    end_date TEXT,
    category TEXT NOT NULL,
    description TEXT,
    location TEXT,
    address TEXT,
    coords DECIMAL[] DEFAULT NULL,
    link TEXT,
    time TEXT,
    price TEXT,
    vorher_nachher TEXT,
    restaurant JSONB,
    bar JSONB,
    treatment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RATINGS TABLE (User ratings for events)
-- =============================================
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'nick_solli',
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    liked BOOLEAN DEFAULT FALSE,
    disliked BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- =============================================
-- DATE HISTORY (Completed dates with ratings)
-- =============================================
CREATE TABLE IF NOT EXISTS date_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'nick_solli',
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    emoji TEXT,
    category TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    photos TEXT[],
    date_completed TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LOVE LETTERS
-- =============================================
CREATE TABLE IF NOT EXISTS love_letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL,
    text TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BUCKET LIST
-- =============================================
CREATE TABLE IF NOT EXISTS bucket_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'nick_solli',
    emoji TEXT NOT NULL,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPENSES (Budget Tracker)
-- =============================================
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'nick_solli',
    amount DECIMAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BUDGET SETTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS budget_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'nick_solli' UNIQUE,
    monthly_budget DECIMAL DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DESTINATIONS (Travel/Globe)
-- =============================================
CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'nick_solli',
    name TEXT NOT NULL,
    country TEXT,
    lat DECIMAL NOT NULL,
    lon DECIMAL NOT NULL,
    status TEXT CHECK (status IN ('visited', 'wishlist')) DEFAULT 'wishlist',
    visit_date DATE,
    diary TEXT,
    photos TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACHIEVEMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'nick_solli',
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- =============================================
-- MEMORIES (Photos with captions)
-- =============================================
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'nick_solli',
    photo_url TEXT NOT NULL,
    caption TEXT,
    date DATE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- For now, allow all access (private app)
-- =============================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon users (private app, no auth needed)
CREATE POLICY "Allow all for anon" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON ratings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON date_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON love_letters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON bucket_list FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON budget_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON destinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON achievements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON memories FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- INSERT DEFAULT BUCKET LIST ITEMS
-- =============================================
INSERT INTO bucket_list (emoji, text, sort_order) VALUES
    ('🌋', 'Vulkan besteigen', 1),
    ('🎿', 'Zusammen Skifahren lernen', 2),
    ('🏕️', 'Unter freiem Himmel schlafen', 3),
    ('🎭', '10 verschiedene Musicals sehen', 4),
    ('🍳', 'Zusammen einen Kochkurs machen', 5),
    ('🏃', 'Marathon zusammen laufen', 6),
    ('🎨', 'Gemeinsam ein Bild malen', 7),
    ('🚂', 'Interrail durch Europa', 8),
    ('🤿', 'Tauchen gehen', 9),
    ('🎪', 'Zu einem Festival fahren', 10)
ON CONFLICT DO NOTHING;

-- =============================================
-- INSERT DEFAULT BUDGET SETTINGS
-- =============================================
INSERT INTO budget_settings (user_id, monthly_budget)
VALUES ('nick_solli', 500)
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT 'Datebuch Schema created successfully!' as message;
