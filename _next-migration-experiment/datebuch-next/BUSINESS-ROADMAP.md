# Datebuch - Business Roadmap & Skalierungsplan

## Aktuelle Phase: MVP (Minimum Viable Product)

**Status:** Private App für Nick & Solli
**Kosten:** 0€/Monat
**Nutzer:** 2

---

## Phasen-Übersicht

| Phase | Nutzer | Monatliche Kosten | Einnahmen (bei 5€/Nutzer) |
|-------|--------|-------------------|---------------------------|
| MVP | 1-10 | 0€ | 0€ (privat) |
| Early Adopters | 10-50 | ~10€ | 50-250€ |
| Wachstum | 50-200 | ~100€ | 250-1.000€ |
| Professionell | 200-1.000 | ~500€ | 1.000-5.000€ |
| Scale | 1.000+ | ~2.000€+ | 5.000€+ |

---

## Phase 1: MVP (Jetzt)

### Kostenlose APIs
| API | Limit | Nutzen |
|-----|-------|--------|
| **Ticketmaster** | 5.000 Calls/Tag | Konzerte, Shows, Events |
| **OpenWeatherMap** | 1.000.000 Calls/Monat | Wetter für Date-Planung |

### Infrastruktur (kostenlos)
| Service | Plan | Limit |
|---------|------|-------|
| **Vercel** | Free | 100GB Bandwidth, 6000 Build Min |
| **Supabase** | Free | 500MB DB, 2GB Storage |
| **GitHub** | Free | Unlimited Repos |

### Features
- [x] Event-Datenbank mit manueller Pflege
- [x] Kalender-Ansicht
- [x] Kategorien & Filter
- [x] Favoriten & Ratings
- [x] Bucket List
- [x] Love Letters
- [x] Wetter-Integration
- [x] Neue Events via Ticketmaster

### Manuelle Aufgaben
- Restaurant-Daten pflegen
- Öffnungszeiten prüfen
- Geschlossene Locations entfernen
- Lokale Events recherchieren (Wellness, Handwerk, etc.)

---

## Phase 2: Early Adopters (10-50 Nutzer)

### Trigger für diese Phase
- Erste Beta-Tester außerhalb Nick & Solli
- Positive Resonanz auf die App
- Wunsch nach mehr Städten/Locations

### Neue APIs
| API | Kosten | Nutzen |
|-----|--------|--------|
| **Google Places** | ~50€/Monat | Öffnungszeiten, "Geschlossen"-Status |

### Upgrade Infrastruktur
| Service | Plan | Kosten | Grund |
|---------|------|--------|-------|
| **Vercel** | Pro | 20$/Monat | Mehr Bandwidth, Analytics |
| **Supabase** | Pro | 25$/Monat | Mehr Storage, Daily Backups |

### Neue Features
- [ ] Multi-Stadt-Support (Hamburg, Berlin, München, etc.)
- [ ] User-Accounts mit Authentifizierung
- [ ] Couple-Pairing (Partner einladen)
- [ ] Push-Benachrichtigungen
- [ ] Event-Erinnerungen

### Team
- 1 Entwickler (du)
- Optional: 1 Content-Person (Events recherchieren)

---

## Phase 3: Wachstum (50-200 Nutzer)

### Trigger für diese Phase
- Stabile Nutzerbasis
- Wiederkehrende Einnahmen > 250€/Monat
- Anfragen für mehr Features

### Neue APIs
| API | Kosten | Nutzen |
|-----|--------|--------|
| **Google Places** | ~100€/Monat | Mehr API-Calls |
| **Yelp Fusion** | 229$/Monat | Bewertungen, Fotos, Reviews |

### Upgrade Infrastruktur
| Service | Plan | Kosten | Grund |
|---------|------|--------|-------|
| **Vercel** | Pro | 20$/Monat | - |
| **Supabase** | Pro | 25$/Monat | - |
| **Sentry** | Team | 26$/Monat | Error Tracking |
| **Resend** | Pro | 20$/Monat | E-Mail Notifications |

### Neue Features
- [ ] Restaurant-Reservierungen (OpenTable API)
- [ ] Ticket-Kauf direkt in der App (Ticketmaster Affiliate)
- [ ] Personalisierte Empfehlungen (ML-basiert)
- [ ] Date-Verlauf mit Fotos & Notizen
- [ ] Gemeinsamer Kalender (Google/Apple Calendar Sync)
- [ ] In-App Chat zwischen Partnern

### Monetarisierung
- Abo-Modell: 4,99€/Monat oder 49€/Jahr
- Freemium: Basis kostenlos, Premium-Features kostenpflichtig
- Affiliate-Einnahmen: Ticketverkäufe, Restaurant-Reservierungen

### Team
- 1-2 Entwickler
- 1 Content Manager
- Optional: 1 Marketing/Social Media

---

## Phase 4: Professionell (200-1.000 Nutzer)

### Trigger für diese Phase
- Einnahmen > 1.000€/Monat
- Nutzer-Feedback erfordert mehr Stabilität
- Bedarf an Support-System

### Neue APIs
| API | Kosten | Nutzen |
|-----|--------|--------|
| **Google Places** | ~200€/Monat | Höheres Volumen |
| **Yelp Fusion** | 299$/Monat | Enhanced Tier |
| **Eventbrite** | Kostenlos | Mehr Event-Quellen |
| **OpenTable** | Revenue Share | Reservierungen |

### Upgrade Infrastruktur
| Service | Plan | Kosten | Grund |
|---------|------|--------|-------|
| **Vercel** | Pro | 20$/Monat | - |
| **Supabase** | Team | 599$/Monat | Höhere Limits, SOC2 |
| **Sentry** | Team | 26$/Monat | - |
| **Resend** | Pro | 20$/Monat | - |
| **Intercom** | Starter | 74$/Monat | Customer Support |
| **Mixpanel** | Growth | 20$/Monat | Analytics |

### Neue Features
- [ ] Native iOS App (React Native oder Swift)
- [ ] Native Android App
- [ ] Offline-Modus
- [ ] AI Date-Planner (GPT-Integration)
- [ ] Gruppen-Dates (mehr als 2 Personen)
- [ ] Event-Hosting (eigene Events erstellen)
- [ ] Social Features (Freunde, Empfehlungen teilen)

### Rechtliches
- [ ] AGB & Datenschutzerklärung (Anwalt)
- [ ] Impressum
- [ ] DSGVO-Compliance
- [ ] Cookie-Banner

### Team
- 2-3 Entwickler
- 1 Content Manager
- 1 Customer Support
- 1 Marketing

---

## Phase 5: Scale (1.000+ Nutzer)

### Trigger für diese Phase
- Einnahmen > 5.000€/Monat
- Expansion in neue Märkte
- Investoren-Interesse

### Enterprise APIs
| API | Kosten | Nutzen |
|-----|--------|--------|
| **Google Places** | ~500€+/Monat | Enterprise Volume |
| **Yelp Fusion** | 643$/Monat | Premium Tier |
| **Michelin** | Verhandlung | Premium Restaurant-Daten |
| **Viator** | Revenue Share | Aktivitäten & Touren |

### Enterprise Infrastruktur
| Service | Plan | Kosten |
|---------|------|--------|
| **Vercel** | Enterprise | Custom |
| **Supabase** | Enterprise | Custom |
| **AWS/GCP** | Custom | Variable |
| **Datadog** | Pro | ~200$/Monat |

### Neue Features
- [ ] White-Label für Hotels/Reiseveranstalter
- [ ] B2B API für Partner
- [ ] Internationale Expansion
- [ ] Multi-Language Support
- [ ] Premium Concierge Service

### Team
- 5+ Entwickler
- 2 Content Manager
- 2 Customer Support
- 2 Marketing
- 1 Product Manager
- 1 Data Analyst

---

## API-Kosten Zusammenfassung

| Phase | Google Places | Yelp | Andere | Infra | Total |
|-------|--------------|------|--------|-------|-------|
| MVP | 0€ | 0€ | 0€ | 0€ | **0€** |
| Early | ~50€ | 0€ | 0€ | ~45€ | **~95€** |
| Wachstum | ~100€ | ~230€ | ~20€ | ~90€ | **~440€** |
| Professionell | ~200€ | ~300€ | ~50€ | ~760€ | **~1.310€** |
| Scale | ~500€+ | ~650€ | ~200€ | ~1.500€+ | **~2.850€+** |

---

## Wichtige Entscheidungspunkte

### Wann Google Places aktivieren?
- **Trigger:** 50+ Locations ODER erste zahlende Nutzer
- **Grund:** Manuelle Pflege wird zu aufwändig
- **ROI:** Zeitersparnis > API-Kosten

### Wann Yelp aktivieren?
- **Trigger:** 100+ Nutzer UND Einnahmen > 500€/Monat
- **Grund:** Bewertungen sind Premium-Feature
- **ROI:** Höhere Conversion durch bessere Daten

### Wann Native Apps?
- **Trigger:** 500+ aktive Nutzer
- **Grund:** PWA reicht für Start, Native für Retention
- **Kosten:** ~10.000-30.000€ Entwicklung oder React Native

### Wann Investoren?
- **Trigger:** Product-Market Fit bewiesen (>1.000 aktive Nutzer)
- **Grund:** Schnellere Skalierung
- **Alternative:** Bootstrapping mit Einnahmen

---

## Kostenlose Alternativen (für immer)

| Statt | Nutze | Einschränkung |
|-------|-------|---------------|
| Google Places | OpenStreetMap Overpass API | Keine Bewertungen |
| Yelp | Manuelle Pflege | Zeitaufwand |
| Bezahlte Events | Ticketmaster (kostenlos) | Nur Ticketmaster-Events |
| Wetter-Premium | OpenWeatherMap Free | Reicht für 99% der Fälle |

---

## Checkliste vor Launch

### Technisch
- [ ] Error Tracking einrichten (Sentry)
- [ ] Analytics einrichten (Vercel Analytics / Mixpanel)
- [ ] Backup-Strategie (Supabase Auto-Backups)
- [ ] SSL/HTTPS (automatisch bei Vercel)
- [ ] Performance-Optimierung (Lighthouse Score > 90)

### Rechtlich
- [ ] Impressum erstellen
- [ ] Datenschutzerklärung erstellen
- [ ] AGB erstellen
- [ ] Cookie-Consent einbauen
- [ ] DSGVO-Anfragen-Prozess definieren

### Business
- [ ] Preismodell festlegen
- [ ] Payment-Provider wählen (Stripe empfohlen)
- [ ] Kündigungs-Prozess definieren
- [ ] Support-Kanal einrichten (E-Mail / Chat)
- [ ] Feedback-Loop etablieren

---

## Kontakt & Ressourcen

### API Dokumentationen
- Ticketmaster: https://developer.ticketmaster.com/
- OpenWeatherMap: https://openweathermap.org/api
- Google Places: https://developers.google.com/maps/documentation/places
- Yelp Fusion: https://docs.developer.yelp.com/

### Nützliche Tools
- Stripe (Payments): https://stripe.com
- Resend (E-Mail): https://resend.com
- Sentry (Error Tracking): https://sentry.io
- Mixpanel (Analytics): https://mixpanel.com

---

*Dokument erstellt: Dezember 2024*
*Letzte Aktualisierung: Dezember 2024*
