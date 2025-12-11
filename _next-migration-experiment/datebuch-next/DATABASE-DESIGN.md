# Datebuch - Erweitertes Datenbank-Design

## USP: "Datebuch weiß, wo du den besten Moscow Mule bekommst"

---

## Neue Tabellen für Location-Intelligence

### 1. `locations` - Basis-Informationen

```sql
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basis
    name TEXT NOT NULL,
    slug TEXT UNIQUE,  -- URL-freundlich: "clouds-hill"
    type TEXT NOT NULL CHECK (type IN ('restaurant', 'bar', 'cafe', 'club', 'venue', 'activity')),

    -- Adresse
    address TEXT,
    district TEXT,  -- "Schanzenviertel", "St. Pauli", etc.
    city TEXT DEFAULT 'Hamburg',
    postal_code TEXT,
    lat DECIMAL,
    lon DECIMAL,

    -- Kontakt
    phone TEXT,
    website TEXT,
    instagram TEXT,

    -- Öffnungszeiten (JSONB für Flexibilität)
    opening_hours JSONB,
    -- Beispiel: {"mon": "17:00-01:00", "tue": "17:00-01:00", ...}

    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'temporarily_closed', 'unverified')),
    verified_at TIMESTAMPTZ,

    -- Meta
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,  -- User ID oder 'system'

    -- Foursquare ID für Sync (optional)
    foursquare_id TEXT,
    google_place_id TEXT
);
```

### 2. `location_tags` - Das Herzstück des Features

```sql
CREATE TABLE location_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,

    -- Tag-Kategorien
    category TEXT NOT NULL CHECK (category IN (
        'food',           -- "Carbonara", "Pizza", "Burger"
        'drink',          -- "Moscow Mule", "Aperol Spritz", "Craft Beer"
        'ingredient',     -- "Frangelico", "Mezcal", "Vegane Optionen"
        'activity',       -- "Flipper", "Dart", "Kicker", "Billard"
        'vibe',           -- "Romantisch", "Laut", "Gemütlich", "Hip"
        'feature',        -- "Terrasse", "Kamin", "Live Musik"
        'price',          -- "Günstig", "Mittel", "Gehoben"
        'dietary'         -- "Vegan", "Vegetarisch", "Glutenfrei"
    )),

    tag TEXT NOT NULL,  -- Der eigentliche Tag: "Moscow Mule"

    -- Qualitätsbewertung
    is_specialty BOOLEAN DEFAULT FALSE,  -- "Bekannt für..."
    quality_score DECIMAL DEFAULT 0,     -- Berechnet aus Votes

    -- Voting
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,

    -- Meta
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,

    UNIQUE(location_id, category, tag)
);
```

### 3. `tag_votes` - User-Bewertungen für Tags

```sql
CREATE TABLE tag_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id UUID REFERENCES location_tags(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,

    vote INTEGER CHECK (vote IN (-1, 1)),  -- Downvote oder Upvote

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tag_id, user_id)  -- Ein User, ein Vote pro Tag
);
```

### 4. `location_reviews` - Detaillierte Bewertungen

```sql
CREATE TABLE location_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,

    -- Bewertung
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    date_rating INTEGER CHECK (date_rating >= 1 AND date_rating <= 5),  -- "Date-tauglichkeit"

    -- Text
    review_text TEXT,

    -- Was wurde konsumiert (für Empfehlungen)
    items_tried JSONB,  -- ["Carbonara", "Moscow Mule"]

    -- Meta
    visit_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(location_id, user_id, visit_date)  -- Ein Review pro Besuch
);
```

### 5. `menu_items` - Speisekarten-Datenbank

```sql
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,

    -- Item
    name TEXT NOT NULL,
    category TEXT,  -- "Vorspeise", "Hauptgang", "Cocktails", etc.
    description TEXT,

    -- Preis
    price DECIMAL,
    price_range TEXT CHECK (price_range IN ('€', '€€', '€€€', '€€€€')),

    -- Attribute
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_signature BOOLEAN DEFAULT FALSE,  -- Signature Dish

    -- Bewertung
    avg_rating DECIMAL,
    rating_count INTEGER DEFAULT 0,

    -- Meta
    last_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. `location_photos` - Bilder

```sql
CREATE TABLE location_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,

    url TEXT NOT NULL,
    caption TEXT,
    photo_type TEXT CHECK (photo_type IN ('interior', 'exterior', 'food', 'drink', 'menu', 'vibe')),

    uploaded_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Beispiel-Queries

### "Beste Carbonara in Hamburg"
```sql
SELECT l.name, l.district, lt.quality_score
FROM locations l
JOIN location_tags lt ON l.id = lt.location_id
WHERE lt.tag ILIKE '%carbonara%'
  AND lt.category = 'food'
  AND l.city = 'Hamburg'
  AND l.status = 'active'
ORDER BY lt.quality_score DESC, lt.upvotes DESC
LIMIT 10;
```

### "Bars mit Frangelico"
```sql
SELECT l.name, l.address
FROM locations l
JOIN location_tags lt ON l.id = lt.location_id
WHERE lt.tag ILIKE '%frangelico%'
  AND lt.category = 'ingredient'
  AND l.type = 'bar'
ORDER BY lt.quality_score DESC;
```

### "Locations mit Flipper in St. Pauli"
```sql
SELECT l.name, l.type
FROM locations l
JOIN location_tags lt ON l.id = lt.location_id
WHERE lt.tag ILIKE '%flipper%'
  AND lt.category = 'activity'
  AND l.district = 'St. Pauli';
```

### "Romantische Restaurants mit veganen Optionen"
```sql
SELECT DISTINCT l.name
FROM locations l
JOIN location_tags lt1 ON l.id = lt1.location_id
JOIN location_tags lt2 ON l.id = lt2.location_id
WHERE lt1.tag = 'Romantisch' AND lt1.category = 'vibe'
  AND lt2.tag = 'Vegan' AND lt2.category = 'dietary'
  AND l.type = 'restaurant';
```

---

## Tag-Kategorien (Vorschläge)

### Food Tags
- Pasta, Pizza, Burger, Sushi, Ramen, Tacos
- Frühstück, Brunch, Tapas, Mezze
- Kuchen, Eis, Desserts

### Drink Tags
- Moscow Mule, Aperol Spritz, Negroni, Old Fashioned
- Craft Beer, Naturwein, Whisky
- Matcha, Specialty Coffee

### Ingredient Tags (für Bars)
- Frangelico, Mezcal, Chartreuse, Aperol
- Gin-Auswahl, Rum-Auswahl, Whisky-Auswahl

### Activity Tags
- Flipper, Dart, Kicker, Billard
- Live Musik, DJ, Karaoke
- Brettspiele, Quiz Night

### Vibe Tags
- Romantisch, Gemütlich, Hip, Laut
- Retro, Industrial, Boho, Minimalistisch
- Versteckt (Hidden Gem), Touristisch

### Feature Tags
- Terrasse, Dachterrasse, Garten
- Kamin, Kerzen, Lichterketten
- Reservierung nötig, Walk-in friendly
- Hundefreundlich, Kinderfreundlich

### Dietary Tags
- Vegan, Vegetarisch, Pescetarisch
- Glutenfrei, Laktosefrei
- Halal, Kosher

---

## Gamification: Tag-Beiträge

### Punkte-System
| Aktion | Punkte |
|--------|--------|
| Neuen Tag hinzufügen | +10 |
| Tag wird bestätigt (5+ Upvotes) | +25 |
| Foto hochladen | +15 |
| Review schreiben | +20 |
| Neues Menu Item | +10 |
| Fehler melden (bestätigt) | +30 |

### Badges
- **Entdecker** - 10 neue Locations besucht
- **Tastemaker** - 50 Tags mit >10 Upvotes
- **Cocktail-Experte** - 20 Drink-Tags hinzugefügt
- **Local Hero** - 100 Beiträge in einem Stadtteil
- **Hidden Gem Hunter** - 5 Locations vor allen anderen gefunden

---

## Migration: SQL für Supabase

```sql
-- Locations
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('restaurant', 'bar', 'cafe', 'club', 'venue', 'activity')),
    address TEXT,
    district TEXT,
    city TEXT DEFAULT 'Hamburg',
    postal_code TEXT,
    lat DECIMAL,
    lon DECIMAL,
    phone TEXT,
    website TEXT,
    instagram TEXT,
    opening_hours JSONB,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'temporarily_closed', 'unverified')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,
    foursquare_id TEXT,
    google_place_id TEXT
);

-- Location Tags
CREATE TABLE IF NOT EXISTS location_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('food', 'drink', 'ingredient', 'activity', 'vibe', 'feature', 'price', 'dietary')),
    tag TEXT NOT NULL,
    is_specialty BOOLEAN DEFAULT FALSE,
    quality_score DECIMAL DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,
    UNIQUE(location_id, category, tag)
);

-- Tag Votes
CREATE TABLE IF NOT EXISTS tag_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id UUID REFERENCES location_tags(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    vote INTEGER CHECK (vote IN (-1, 1)),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tag_id, user_id)
);

-- Location Reviews
CREATE TABLE IF NOT EXISTS location_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    date_rating INTEGER CHECK (date_rating >= 1 AND date_rating <= 5),
    review_text TEXT,
    items_tried JSONB,
    visit_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(location_id, user_id, visit_date)
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    price DECIMAL,
    price_range TEXT CHECK (price_range IN ('€', '€€', '€€€', '€€€€')),
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_signature BOOLEAN DEFAULT FALSE,
    avg_rating DECIMAL,
    rating_count INTEGER DEFAULT 0,
    last_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location Photos
CREATE TABLE IF NOT EXISTS location_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    photo_type TEXT CHECK (photo_type IN ('interior', 'exterior', 'food', 'drink', 'menu', 'vibe')),
    uploaded_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all" ON location_tags FOR ALL USING (true);
CREATE POLICY "Allow all" ON tag_votes FOR ALL USING (true);
CREATE POLICY "Allow all" ON location_reviews FOR ALL USING (true);
CREATE POLICY "Allow all" ON menu_items FOR ALL USING (true);
CREATE POLICY "Allow all" ON location_photos FOR ALL USING (true);

-- Indexes für Performance
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_district ON locations(district);
CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_location_tags_tag ON location_tags(tag);
CREATE INDEX idx_location_tags_category ON location_tags(category);
```

---

## Nächste Schritte

1. **SQL in Supabase ausführen** - Tabellen erstellen
2. **50-100 Hamburg Locations manuell eintragen** - Qualität > Quantität
3. **Tag-System in der App einbauen** - User können Tags hinzufügen/voten
4. **Such-UI bauen** - "Wo bekomme ich den besten Moscow Mule?"
5. **Später: Foursquare-Import** für Basis-Daten, dann mit Tags anreichern

---

*Erstellt: Dezember 2024*
