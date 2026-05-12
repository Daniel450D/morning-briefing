# Morning Briefing Dashboard

Ein tägliches Morgen-Briefing Dashboard mit KI-News, Datacenter/Infrastruktur-News, deutsche Wirtschaft und Börsenübersicht.

## Features

- 📰 **Nachrichten-Briefing** mit 4 Kategorien:
  - Deutsche Wirtschaft und Mittelstand
  - KI & Modelle
  - Datacenter & Infrastruktur
  - Security & Networking
  - Modern Work

- 📈 **Live Börsenübersicht** mit echten Aktienkursen:
  - CANCOM SE, Computacenter, Bechtle
  - DAX, SDAX, TechDAX
  - Automatisch aktualisiert täglich um 06:00 Uhr

## Automatische Updates

GitHub Actions aktualisiert die Aktienkurse **täglich um 06:00 Uhr UTC** (07:00-08:00 Uhr deutscher Zeit):

1. Ruft aktuelle Kurse von Yahoo Finance ab
2. Aktualisiert automatisch die `index.html`
3. Committed und pushed die Änderungen

### Manueller Update

```bash
npm run update-stocks
```

## Live

🌐 **Website**: https://Daniel450D.github.io/morning-briefing/

## Technologie

- Static HTML/CSS/JavaScript
- GitHub Pages für Hosting
- GitHub Actions für tägliche Updates
- Yahoo Finance API für Aktiendaten

## Lizenz

MIT
