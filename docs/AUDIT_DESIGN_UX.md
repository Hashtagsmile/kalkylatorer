# Design & UX/UI Audit – RäntaPåRänta

*Senast uppdaterad: februari 2025*

---

## Sammanfattning

| Område | Betyg | Kommentar |
|--------|-------|-----------|
| **Visuell identitet** | B | Inkonsekvent branding, emoji-ikoner |
| **Färger** | B+ | Bra palett, men accent-färger kan kännas generiska |
| **Typografi** | B | System fonts – fungerar men saknar karaktär |
| **Layout & spacing** | A- | Bra luft, max-width 3xl, konsekvent |
| **Flöde & hierarki** | B | Resultat synligt direkt – bra. Några sidor känns långa |
| **Formulär & inputs** | A | Presets, hjälptexter, touch-vänligt |
| **Clutter** | B- | Pension/CSN har många fält, CalculatorInfoSection tung |
| **Ikoner & logotyp** | C+ | Emojis, inkonsekvent, og-image har typo |
| **Mobil & responsivitet** | A | Bra breakpoints, touch-targets |
| **Tillgänglighet** | A- | Bra fokus, aria, skip link |

**Övergripande: B+**

---

## 1. Visuell identitet & branding

### Problem
- **Catalog:** Header visar "Kalkylatorer" + GridIcon (slate) – ingen RäntaPåRänta-branding
- **Om-sidan:** RäntaPåRänta + % (emerald) – annorlunda
- **Kalkylatorsidor:** Ingen global header – bara CalculatorPageHeader med tillbaka-länk
- Användaren vet inte var "hem" är på kalkylatorsidor (ingen logotyp i header)

### Rekommendation
- Lägg till en liten logotyp/länk till startsidan i header på alla sidor
- Enhetlig header: Catalog, Om och kalkylatorer bör ha samma logotyp (RäntaPåRänta + %)

---

## 2. Färger

### Nuvarande
- Bakgrund: `slate-50`
- Kort/boxar: `white`, `slate-100`, `slate-200`
- Accent per kalkylator: emerald, amber, purple, teal, indigo, blue
- Disclaimer: `amber-50`, `amber-200`

### Observationer
- Slate + accent fungerar bra
- Accent-färgerna (Tailwind default) känns lite generiska
- Emerald som primär färg passar sparande/finans

### Rekommendation
- Behåll paletten
- Överväg subtil gradient eller mjukare skuggor för mer djup
- Kontrollera kontrast (WCAG AA) för text på accent-bakgrunder

---

## 3. Typografi

### Nuvarande
- `font-family: system-ui, sans-serif` (Tailwind default)
- H1: `text-2xl sm:text-3xl font-bold`
- H2: `text-lg font-semibold`
- Body: `text-sm`, `text-base`

### Observationer
- System fonts = snabbt, tillgängligt
- Saknar tydlig visuell identitet

### Rekommendation
- Överväg en display-font för H1 (t.ex. DM Sans, Plus Jakarta Sans) – subtil förbättring
- Behåll system-ui som fallback

---

## 4. Layout & spacing

### Bra
- `max-w-3xl` konsekvent
- `space-y-5`, `space-y-6` mellan sektioner
- `p-5 sm:p-6` på kort
- `rounded-2xl` enhetligt

### Mindre bra
- AdSlot-placering: top/middle/bottom kan kännas lite slumpmässig
- CalculatorInfoSection (Fakta, Ordlista, FAQ, Källor, Läs mer) – mycket innehåll under resultatet

---

## 5. Flöde & användarresa

### Bra
- Resultat visas direkt under formuläret – ingen klick krävs
- Tillbaka-länk tydlig
- "← Fler kalkylatorer" i botten

### Mindre bra
- **Pensionskalkylator:** 8+ fält – kan kännas överväldigande. Överväg gruppering (t.ex. "Allmän pension" / "Privat sparande" i collapsible)
- **CSN-kalkylator:** Enklare, bra
- **CalculatorInfoSection:** Lång – användaren måste scrolla mycket. Överväg att dölja FAQ/Ordlista som expanderbar eller separata flikar

---

## 6. Formulär & inputs

### Bra
- Presets (knappar) – snabbt att välja
- Hjälptexter under labels
- InfoTooltip vid behov
- `min-h-[44px]`, `touch-manipulation` för touch
- Fokus-ring tydlig

### Mindre bra
- Vissa inputs har både presets OCH fritext – kan bli visuellt rörigt (t.ex. Bolån: 5 presets + input)
- Range-sliders endast i RäntaPåRänta – övriga använder bara number inputs

---

## 7. Clutter (visuell röra)

### Identifierat
1. **Pensionskalkylator:** Många fält i rad – födelseår, pensionsålder (4 knappar + input), lön, år, checkbox, privat sparande (3 fält)
2. **CalculatorInfoSection:** 5 sektioner (Fakta, Ordlista, FAQ, Källor, Läs mer) – mycket på en sida
3. **Disclaimer:** Alltid synlig – tar plats (men viktig juridisk)
4. **AdSlot-placeholders:** När AdSense är av – grå dashed boxar kan kännas onödiga i dev

### Rekommendation
- Gruppera pensionsfält i visuella block (t.ex. "Din situation" / "Privat sparande")
- CalculatorInfoSection: Överväg tabs eller accordion för Fakta/Ordlista/FAQ
- Dölj AdSlot-placeholders i produktion om inga annonser (eller använd mindre påfallande placeholder)

---

## 8. Ikoner & logotyp

### Problem
- **Emoji-ikoner:** 🏛 🏠 📈 💼 🎓 – ser olika ut på iOS/Android/Windows
- **Catalog:** GridIcon (SVG) – annorlunda stil
- **Favicon:** Grön ruta med % – enkel, fungerar
- **og-image.svg:** **Typo:** "RäntaP?Ränta" – "å" renderas som "?" (encoding-problem)

### Rekommendation
- **Hög prioritet:** Fixa og-image.svg – använd `&#229;` för å, `&#228;` för ä
- Ersätt emojis med enkla SVG-ikoner (Lucide, Heroicons) – konsekvent look
- Behåll % som logotyp – det fungerar

---

## 9. Mobil & responsivitet

### Bra
- `sm:`, `lg:` breakpoints används
- Grid: `grid-cols-2 sm:grid-cols-4` på resultat
- Touch-targets 44px+
- Viewport meta korrekt

### Mindre bra
- Inflationskalkylator: Knappar "Vad blir X kr om Y år?" kan bli trånga på små skärmar – överväg stapling
- KommunPicker: Dropdown med 50 kommuner – bra, men sökfältet kan vara litet på mobil

---

## 10. Övriga UX-aspekter

### Bra
- ShareModal: Escape stänger, klick utanför stänger
- Print: no-print på navigation, annonser
- URL-params: delbara länkar

### Mindre bra
- Ingen loading state (beräkningar är synkona – ok)
- Ingen "Spara" eller "Jämför"-funktion mellan scenarier (RäntaPåRänta har TargetCalculator – bra)

---

## Åtgärdslista (prioriterad)

| Prioritet | Åtgärd | Status |
|-----------|--------|--------|
| **Hög** | Fixa og-image.svg typo (RäntaP?Ränta → RäntaPåRänta) | ✅ Klar |
| **Hög** | Lägg till logotyp/hemlänk i header på kalkylatorsidor | ✅ Klar |
| **Medel** | Ersätt emoji-ikoner med SVG (konsekvent look) | ✅ Klar |
| **Medel** | Catalog: använd RäntaPåRänta-branding istället för "Kalkylatorer" | ✅ Klar |
| **Medel** | Gruppera pensionsfält visuellt (block/cards) | ✅ Klar |
| **Låg** | CalculatorInfoSection: accordion/tabs för att minska scroll | ✅ Klar |
| **Låg** | Överväg display-font för H1 | ✅ Klar (Plus Jakarta Sans) |
| **Låg** | Dölj eller minimera AdSlot-placeholder när ej aktiverad | Ej implementerat |

---

## Quick wins (låg effort)

1. **og-image.svg** – Fixa å/ä med HTML entities ✅
2. **Catalog header** – Byt "Kalkylatorer" till "RäntaPåRänta" + samma logotyp som Om ✅
3. **Kalkylatorsidor** – Lägg till liten logotyp-länk till / i toppen ✅
