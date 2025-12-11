# Datebuch - UX Konzept

## Vision

**"Ein persönlicher Date-Concierge, der denkt wie ein Mensch"**

Nicht: "Hier sind 136 Events, viel Spaß beim Suchen"
Sondern: "Ihr geht ins König der Löwen? Ich empfehle vorher das Maquís (10 Min zu Fuß, vegetarisch, romantisch) und danach einen Absacker im Hadley's"

---

## Kern-Philosophie

### Wie Menschen über Dates nachdenken:

1. **Anlass-basiert**
   - "Wir haben Jahrestag"
   - "Solli hatte einen stressigen Tag"
   - "Wir wollen was Neues ausprobieren"

2. **Zeit-basiert**
   - "Sonntagmorgen" → Brunch
   - "Freitagabend" → Ausgehen
   - "Feierabend unter der Woche" → Schnell & entspannt

3. **Aktivitäts-kombiniert**
   - "Theater + Essen vorher"
   - "Wellness + Lunch danach"
   - "Spaziergang + Café"

4. **Stimmungs-basiert**
   - "Romantisch"
   - "Entspannt"
   - "Abenteuerlich"
   - "Gemütlich"

---

## App-Struktur

### 1. Home - "Heute für euch"

Keine Event-Liste, sondern **ein** perfekter Date-Vorschlag basierend auf:
- Wochentag & Uhrzeit
- Wetter
- Eure Vorlieben (gelernt über Zeit)
- Was ihr noch nicht gemacht habt

```
┌─────────────────────────────────────┐
│  Guten Abend, Nick & Solli! 💕      │
│                                     │
│  Heute ist Freitagabend, 8°C        │
│  Perfekt für: Gemütlich drinnen     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🎭 Unser Vorschlag          │   │
│  │                              │   │
│  │  18:30  Maquís               │   │
│  │         Vegetarisch, St.Pauli│   │
│  │                              │   │
│  │  20:00  Schmidts Tivoli      │   │
│  │         "Heiße Ecke"         │   │
│  │                              │   │
│  │  23:00  Hadley's             │   │
│  │         Speakeasy Cocktails  │   │
│  │                              │   │
│  │  [Das machen wir!]  [Neu]    │   │
│  └─────────────────────────────┘   │
│                                     │
│  Oder: Selbst planen →              │
└─────────────────────────────────────┘
```

### 2. Planen - "Date Builder"

Intelligente Schritt-für-Schritt Planung:

**Schritt 1: Was ist der Anlass?**
- Normaler Abend
- Etwas Besonderes (Jahrestag, Geburtstag)
- Spontan
- Trösten / Entspannen

**Schritt 2: Was ist der Kern?**
- Essen gehen
- Kultur (Theater, Konzert, Museum)
- Aktivität (Wellness, Sport, Workshop)
- Ausgehen (Bar, Club)
- Draußen (Spaziergang, Picknick)

**Schritt 3: Automatische Ergänzung**
```
Du hast gewählt: König der Löwen (20:00)

Vorher essen? (Theater ist in der HafenCity)
├── Schick: VLET (8 Min, €€€)
├── Entspannt: ÜberQuell (12 Min, €€)
└── Schnell: Café Paris (5 Min, €€)

Nachher noch was trinken?
├── In der Nähe: Störtebeker (2 Min)
├── Speakeasy: Clockers (15 Min)
└── Absacker: Zum Silbersack (20 Min)
```

### 3. Entdecken - "Was gibt's?"

Smart durchsuchbare Datenbank:

**Such-Modi:**

1. **Freitext-Suche**
   - "Beste Carbonara Hamburg"
   - "Bar mit Flipper St. Pauli"
   - "Veganes Frühstück Schanze"

2. **Filter-Kombination**
   ```
   Kategorie: Restaurant
   Vibe: Romantisch
   Preis: €€
   Dietary: Vegetarische Optionen
   Stadtteil: Egal

   → 12 Ergebnisse
   ```

3. **Situation-basiert**
   - "Solli hat um 18:00 Feierabend"
   - "Es regnet"
   - "Wir haben 3 Stunden Zeit"

   → Passende Vorschläge

### 4. Sammlung - "Unsere Orte"

```
┌─────────────────────────────────────┐
│  📍 Unsere Orte                     │
│                                     │
│  ❤️ Favoriten (12)                  │
│  ✓ Waren wir (34)                   │
│  📌 Wollen wir hin (28)             │
│  🏆 Geheimtipps (8)                 │
│                                     │
│  Letzte Dates:                      │
│  • König der Löwen + Maquís  ⭐⭐⭐⭐⭐ │
│  • Nordwandhalle + Ramen     ⭐⭐⭐⭐  │
│  • Wellnest Spa              ⭐⭐⭐⭐⭐ │
└─────────────────────────────────────┘
```

### 5. Kalender - "Wann?"

Nicht nur Events, sondern **geplante Dates**:

```
Dezember 2024

Fr 13  🎭 Schmidts Tivoli
       + Maquís vorher

Sa 14  ⭐ Jahrestag!
       → Noch nicht geplant
       [Vorschläge ansehen]

So 15  🧘 Wellnest Spa
       Gebucht: 14:00-17:00
```

### 6. Reisen - "Globus"

Bucket List für Reiseziele + vergangene Reisen mit Erinnerungen.

---

## Intelligente Features

### 1. Kontext-Erkennung

**Input:** "Wir gehen ins Thalia Theater"
**System erkennt:**
- Location: Thalia Theater, Alstertor
- Zeit: Wahrscheinlich Abendvorstellung (19:30)
- Dauer: ~3 Stunden
- Stadtteil: Innenstadt

**Output:**
```
Thalia Theater - toll!

Vorher (ab 17:30):
• Café Paris (5 Min) - Französisch, €€
• Alex (3 Min) - Casual, €

Nachher (ab 22:30):
• Le Lion (8 Min) - Cocktails
• Bar Italia (10 Min) - Wein & Snacks
```

### 2. Lern-Algorithmus

Nach jedem Date:
- "Wie war's?" (1-5 Sterne)
- "Was war gut?" (Tags auswählen)
- "Wieder hingehen?" (Ja/Nein)

System lernt:
- Ihr mögt vegetarisches Essen → mehr veggie Vorschläge
- Ihr geht oft in die Schanze → Vorrang für Schanze
- Ihr mögt keine lauten Bars → filtert automatisch

### 3. Wetter-Integration

```
Samstag: ☀️ 22°C

"Perfekt für draußen! Wie wäre es mit:"
• Picknick an der Alster + Café Erika
• Fahrradtour + Strandperle
• Planten un Blomen + Café Paris
```

### 4. Zeit-Intelligenz

**18:00 Uhr Montag:**
"Solli hat gerade Feierabend (Stadtdeich).
In 20 Min könntet ihr sein bei:"
• Clouds Hill (Cocktails, 15 Min ÖPNV)
• Ti Breizh (Crêpes, 18 Min ÖPNV)

### 5. Kombinations-Vorschläge

**"Perfekte Kombis" - kuratiert:**
- 🎭 Theater + Schick essen → "Die Klassiker"
- 🍕 Pizza + Kino → "Entspannter Abend"
- 💆 Spa + Brunch → "Self-Care Sunday"
- 🎸 Konzert + Feiern → "Nacht durchmachen"

---

## Mobile UI Konzept

### Bottom Navigation
```
[Home] [Planen] [Entdecken] [Sammlung] [Kalender]
  🏠      ✨        🔍          💕         📅
```

### Gestik
- **Swipe Right** auf Vorschlag → Merken
- **Swipe Left** → Nächster Vorschlag
- **Long Press** → Details
- **Pull Down** → Neuen Vorschlag generieren

### Farben
- Background: Deep Slate (#0f172a)
- Primary: Rose Gradient (#f43f5e → #a855f7)
- Cards: Slate 800 mit Blur
- Text: White + Slate 400

### Animationen
- Sanfte Fade-Ins für Cards
- Konfetti bei geplantem Date
- Herzchen-Animation bei Favoriten
- Smooth Transitions überall

---

## Unterschied zu anderen Apps

| Feature | Yelp/Google | Tinder | Datebuch |
|---------|-------------|--------|----------|
| Einzelne Orte finden | ✅ | ❌ | ✅ |
| Date-Kombinationen | ❌ | ❌ | ✅ |
| Kontext-aware | ❌ | ❌ | ✅ |
| Paar-spezifisch | ❌ | ❌ | ✅ |
| Lernend | ❌ | ✅ | ✅ |
| Kuratiert | ❌ | ❌ | ✅ |
| "Beste Carbonara" | ❌ | ❌ | ✅ |

---

## MVP Features (Phase 1)

1. ✅ Home mit Tagesvorschlag
2. ✅ Date Builder (Kern + Ergänzungen)
3. ✅ Such-Funktion mit Tags
4. ✅ Favoriten & "Waren wir"
5. ✅ Einfache Bewertungen

## Phase 2

1. Lern-Algorithmus
2. Kalender-Integration
3. Wetter-Integration
4. Mehr Locations (>100)

## Phase 3

1. Native App
2. Push-Benachrichtigungen
3. Reservierungs-Integration
4. Andere Städte

---

*Konzept erstellt: Dezember 2024*
