# Next.js Migration Experiment (INAKTIV)

**Status**: 🧪 Experimental - NICHT in Production
**Erstellt**: ~2025-12-04
**Gerettet**: 2025-12-11

## Was ist das?

Ein Experiment, das Datebuch von Vanilla HTML/CSS/JS nach Next.js zu migrieren.

## Warum inaktiv?

Die Vanilla-Version (Hauptprojekt) ist:
- ✅ Voll funktional
- ✅ Deployed auf GitHub Pages
- ✅ Einfacher zu warten
- ✅ Schneller für diesen Use-Case

## Wertvolle Inhalte

- `DATABASE-DESIGN.md` - Location-Intelligence Konzept mit Supabase
- `UX-CONCEPT.md` - Design-Überlegungen
- `datebuch-next/` - Next.js App Setup

## Falls du diese Migration fortsetzen willst

1. Prüfe ob `datebuch-next/package.json` up-to-date ist
2. npm install in datebuch-next/
3. Migriere Features schrittweise aus der Vanilla-Version
4. Behalte die Vanilla-Version als Fallback

**Empfehlung**: Nur fortsetzen wenn klarer Vorteil erkennbar (z.B. SSR, API Routes, etc.)
