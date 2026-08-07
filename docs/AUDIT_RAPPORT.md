# RäntaPåRänta – Auditrapport

*Senast uppdaterad: februari 2025*

---

## Sammanfattning

| Område | Betyg | Kommentar |
|--------|-------|-----------|
| **Struktur** | A | Tydlig uppdelning: pages, components, lib, config, data |
| **Konsistens** | B | Små skillnader mellan kalkylatorer (share, footer, länkar) |
| **Kvalitet** | B+ | Bra SEO/a11y-bas, men trasiga länkar och placeholder-URL:er |
| **Innehåll** | A | Bra calculatorInfo, Om-sida, integritetspolicy |
| **Tekniskt** | B | Hårdkodade länkar, oanvända komponenter |
| **UX** | B+ | Bra mobil/print, presets, hjälptexter |

**Övergripande: B+**

---

## 1. Struktur (A)

### Sidor
- `Catalog.tsx` – startsida med 6 kalkylatorer
- `OmSidan.tsx` – Om denna tjänst
- 6 kalkylatorsidor: RäntaPåRänta, Pension, Bolån, Inflation, Lön, CSN

### Komponenter
- Kalkylatorer: `Calculator`, `CalculatorPageHeader`, `CalculatorInfoSection`
- Delning/utskrift: `ShareButton`, `ShareModal`, `PrintResultButton`
- Övrigt: `Disclaimer`, `Footer`, `AdSlot`, `AffiliateSection`, `InfoTooltip`, `KommunPicker`
- Oanvända: `IntroBanner`, `Header`

### Lib & config
- Beräkningar: `bolanCalculations`, `csnCalculations`, `inflationCalculations`, `lonCalculations`, `pensionCalculations`
- `urlParams.ts` (endast RäntaPåRänta)
- `config/yearly.ts`, `config/links.ts`

---

## 2. Konsistens (B)

### Bra
- Alla kalkylatorer har `CalculatorPageHeader` med details/summary
- Presets med samma mönster (knappar, `min-h-[44px]`, `touch-manipulation`)
- Footer med Integritetspolicy + Om denna tjänst
- Hjälptexter under inputs (efter senaste uppdatering)

### Skillnader
| Aspekt | RäntaPåRänta | Övriga |
|--------|--------------|--------|
| Share | ShareButton (Web Share API) | ShareModal (kopiera länk) |
| Footer | `shortText` ej satt | `shortText` |
| Länk nedanför resultat | Saknas | "← Fler kalkylatorer" |
| URL-params | `lib/urlParams.ts` | Inline per sida |

---

## 3. Kvalitet (B+)

### SEO
- Meta tags i `index.html` (title, description, keywords)
- **Problem:** Canonical, OG, Twitter pekar på `example.com` – måste uppdateras vid deploy
- JSON-LD: WebApplication, FAQPage, BreadcrumbList, HowTo – endast för startsida/ränta-på-ränta

### Tillgänglighet
- Skip link, `main#main-content`, `aria-live`, `focus:ring`
- **Problem:** InfoTooltip saknar `aria-expanded`/`aria-controls`
- **Problem:** Resultatsektioner saknar `aria-label` på flera kalkylatorer

### Felhantering
- Ingen Error Boundary
- URL-params valideras med `isNaN`-kontroll

---

## 4. Innehåll (A)

- `calculatorInfo.ts` – facts, glossary, faqs, sources för alla 6
- `privacy.html` – tydlig, uppdaterad
- Om-sidan – förklarar annonser, affiliate, gratis tjänst
- Disclaimers: default, loan, salary, general

---

## 5. Tekniskt (B)

### Problem
1. **Trasig länk:** `#las-mer` finns inte – CalculatorInfoSection har `id="faq-och-kallor"`
2. **Hårdkodad URL:** Pensionkalkylator använder `https://www.pensionsmyndigheten.se` istället för `LINKS.Pensionsmyndigheten`
3. **Oanvända komponenter:** `IntroBanner`, `Header` – ingen import
4. **privacy.html:** "Tillbaka till kalkylatorn" → bör vara "kalkylatorerna"

---

## 6. UX (B+)

- Responsiv, touch-vänlig, print-optimerad
- Presets och hjälptexter på alla inputs
- URL-params sparas och delas

---

## Saker som behöver fixas

| Prioritet | Problem | Status |
|-----------|---------|--------|
| **Hög** | `#las-mer` → `#faq-och-kallor` (trasig länk) | ✅ |
| **Hög** | Canonical/OG/Twitter: `VITE_SITE_URL` vid build | ✅ |
| **Medel** | Pensionsmyndigheten: använd `LINKS.Pensionsmyndigheten` | ✅ |
| **Medel** | Ta bort oanvända `IntroBanner` och `Header` | ✅ |
| **Låg** | privacy.html: "kalkylatorn" → "kalkylatorerna" | ✅ |
| **Låg** | InfoTooltip: `aria-expanded` för a11y | ✅ |
| **Låg** | Resultatsektioner: `aria-label="Beräkningsresultat"` | ✅ |

---

## Quick wins (låg effort, hög/medel impact)

| # | Åtgärd | Status |
|---|--------|--------|
| 1 | Ändra `#las-mer` till `#faq-och-kallor` | ✅ Klar |
| 2 | Lägg till "← Fler kalkylatorer" på RäntaPåRänta | ✅ Klar |
| 3 | Ersätt hårdkodad Pensionsmyndigheten-URL | ✅ Klar |
| 4 | Uppdatera privacy.html "kalkylatorn" → "kalkylatorerna" | ✅ Klar |
| 5 | Lägg till `aria-label` på resultatsektioner | ✅ Klar |
| 6 | Fixa IntroBanner (las-mer → faq-och-kallor) | ✅ Klar (komponenten borttagen) |
| 7 | InfoTooltip: aria-expanded, aria-controls för a11y | ✅ Klar |
| 8 | Ta bort oanvända IntroBanner och Header | ✅ Klar |
| 9 | RäntaPåRänta Footer: shortText för konsistens | ✅ Klar |
| 10 | Canonical/OG-URL:er via VITE_SITE_URL vid build | ✅ Klar |
