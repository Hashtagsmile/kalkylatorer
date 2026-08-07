# Komplett audit – Kalkylatorer (Passiv-inkomst)

**Auditdatum:** 2025-03-01  
**Projekt:** Ränta på ränta / Kalkylatorer (passiv-inkomst)  
**Version:** 1.0.0

---

## Sammanfattning – betyg per område

| Nr | Område | Betyg | Kort |
|----|--------|-------|-----|
| 1 | Projektstruktur | **A-** | Tydlig struktur, några förbättringar möjliga |
| 2 | Kodkvalitet | **B+** | Bra TypeScript, viss duplication |
| 3 | Komponenter | **B** | Återanvändbara komponenter, saknade detaljer |
| 4 | Beräkningar | **A-** | Korrekta formler, FI-amortering ej fullt implementerad |
| 5 | Säkerhet | **A** | Ingen XSS, bra validering av indata |
| 6 | Prestanda | **C+** | Ingen lazy loading, stort initialbundle |
| 7 | SEO | **B** | Bra grund, inkonsekvent antal kalkylatorer |
| 8 | Tillgänglighet | **A-** | Bra ARIA, reduced motion, skip-link |
| 9 | Felhantering | **B-** | Saknar Error Boundary, delvis tydlig feedback |
| 10 | Tester | **F** | Inga enhetstester |
| 11 | Dokumentation | **B** | Bra README, saknar arkitektur |
| 12 | Beroenden & config | **B** | Tydliga beroenden, sitemap ofullständig |

### **Totalt betyg: B** (cirka 3.5/5)

Stabil produktionsklar app med stark tillgänglighet och säkerhet, men utan tester och med prestanda- och SEO-förbättringsområden.

---

## 1. Projektstruktur — A-

### Styrkor

- **Tydlig mappindelning:** `src/pages/`, `src/components/`, `src/lib/`, `src/config/`, `src/data/`
- **Separation of concerns:** Beräkningar i `lib/`, konfiguration i `config/`, rådata i `data/`
- **Single source of truth:** ROUTES i `links.ts`, feature flags i `calculators.ts`, site metadata i `site.ts`
- **Återanvändbar data:** `municipalities.ts`, `calculatorInfo.ts`, `fireScenarios.ts` åtskilda från UI

### Svagheter

- **`TOOL_GROUPS` i Catalog.tsx** — Bör flyttas till t.ex. `config/catalog.ts` för konsistens
- **URL-parametrar:** Flera sidor har egna `getParamsFromUrl`/`buildShareUrl` — kunde centraliseras i `lib/urlParams.ts`
- **Ingen `hooks/`-mapp** — Custom hooks (om tillkommer) har ingen tydlig plats

### Rekommendationer

1. Skapa `config/catalog.ts` med `TOOL_GROUPS`
2. Lägg till `src/hooks/` vid behov
3. Utvärdera gemensam `useUrlParams()`-hook

---

## 2. Kodkvalitet — B+

### Styrkor

- **TypeScript strict:** `tsconfig` har `strict: true`, `noUnusedLocals`, `noUnusedParameters`
- **Tydliga interfaces:** `BolanInput`, `LonInput`, `BolanResult` m.fl.
- **Konsekvent stil:** Prettier/ESLint-antaganden, liknande mönster över sidor
- **JSDoc på viktiga funktioner:** t.ex. `annuityPayment`, `getAmorteringskrav`

### Svagheter

- **Duplicerad URL-parametervalidering:** `EffektivRanta`, `Aterbetalningstid`, `RantapaRanta` m.fl. har liknande parse/clamp-logik
- **Delad `AccentColor`:** `CalculatorPageHeader` använder samma färgklasser för olika accenter
- **`InputWithUnit`:** Växlar till `type="text"` vid `formatThousands` — kan bryta `onChange`-kontrakt för vissa användare

### Rekommendationer

1. Skapa `lib/parseInput.ts` eller liknande för gemensam parse/clamp
2. Dokumentera `InputWithUnit`-beteende (formatThousands)
3. Överväg typer i `types.ts` för fler delade strukturer

---

## 3. Komponenter — B

### Styrkor

- **Återanvändbara komponenter:** `InputWithUnit`, `Accordion`, `CalculatorPageHeader`, `ShareModal`, `ResultActions`, `Chart`
- **Accordion-variants:** `default`, `compact`, `faq`, `select` täcker olika användningsfall
- **Motion-animationer:** Accordion, ShareModal, InfoTooltip, KommunPicker använder `useReducedMotion()`

### Svagheter

- **Preset-knappar utan `aria-label`:** t.ex. i EffektivRanta-scenarier — skärmläsare får inte tydlig beskrivning
- **InfoTooltip:** Ingen `onKeyDown` för Enter/Space — endast klick styr öppning/stängning
- **Ingen design system:** Färger/spacing inte centraliserade som tokens (Tailwind används konsekvent men utan dokumenterade regler)

### Rekommendationer

1. Lägg till `aria-label` på scenarioknappar (t.ex. "Scenariotyp X")
2. Lägg till tangentbordsstöd i InfoTooltip (Enter/Space)
3. Överväg en enkel design-tokens-dokumentation

---

## 4. Beräkningar — A-

### Styrkor

- **Annuitetsformel:** `bolanCalculations.ts`, `effektivRantaCalculations.ts` — korrekt implementerad
- **Källor dokumenterade:** Finansinspektionen, Skatteverket, etc. nämns i kommentarer
- **Edge cases:** `r === 0` hanteras i annuitet; återbetalningstid returnerar `impossible` vid för låg betalning
- **Newton-Raphson:** Effektiv ränta använder IRR-lösning
- **Monte Carlo:** FIRE använder Box-Muller för normaliserad avkastning

### Svagheter

- **FI amorteringskrav:** `getAmorteringskrav()` returnerar rätt procentsatser (0/1/2 %), men `calculateBolan` använder endast standard annuitet. FI:s minimiamortering tillämpas inte dynamiskt i planen.
- **Stora tal:** Ingen explicit hantering av extremt stora belopp (t.ex. > 10^15)
- **`Infinity` i återbetalningstid:** API returnerar `Infinity` vid impossible — UI hanterar det, men kontraktet är ovanligt

### Rekommendationer

1. Utred om FI:s minimiamortering ska påverka månadsplanen (och i så fall hur)
2. Lägg till gränser eller varningar för extremt stora indata
3. Överväg att returnera `{ impossible: true }` istället för `Infinity` i återbetalningstid

---

## 5. Säkerhet — A

### Styrkor

- **Ingen farlig dynamik:** Ingen `dangerouslySetInnerHTML`, `eval`, `document.write`
- **URL-parametrar:** Validering med `parseInt`/`parseFloat`, `isNaN`, min/max
- **Env-variabler:** Endast `VITE_*` — inga secrets exponerade i klient
- **Feedback:** FormSubmit.co — inga credentials i koden

### Svagheter

- **`document.execCommand('copy')`:** Fallback i ShareModal — deprecated men acceptabelt för äldre webbläsare
- **Säkerhetsheaders:** Ingen CSP etc. — hanteras av host (Vercel/Netlify)

### Rekommendationer

1. Behåll clipboard-fallback tills alla målwebbläsare stöder `navigator.clipboard`
2. Överväg CSP-header vid deploy (om hosten stöder det)

---

## 6. Prestanda — C+

### Styrkor

- **Vite:** Snabb dev, tree-shaking
- **Preconnect:** Google Fonts
- **En bundle:** Ingen onödig splitting

### Svagheter

- **Ingen lazy loading:** Alla 23+ sidor importeras direkt i `App.tsx` — initial bundle ~1 MB (minifierad)
- **Begränsad memoization:** Endast `useCallback` i Procentraknare — inga `useMemo`/`React.memo` på tunga komponenter
- **Recharts:** Laddas för alla användare även om endast vissa sidor visar grafer
- **Ingen bundle-analys:** `rollup-plugin-visualizer` eller liknande saknas

### Rekommendationer

1. Lazy-loada sidor med `React.lazy` och `Suspense`
2. Lazy-loada Recharts där den används (eller via dynamic import)
3. Lägg till bundle-analys i build för att följa storlek

---

## 7. SEO — B

### Styrkor

- **Meta tags:** title, description, keywords
- **Open Graph & Twitter:** og:title, og:description, og:image
- **JSON-LD:** WebApplication, FAQPage, BreadcrumbList, HowTo
- **Semantisk HTML:** `lang="sv"`, `main`, `nav`, `section`
- **Canonical:** `{{SITE_URL}}` ersätts vid build
- **Sitemap & robots.txt:** Genereras av Vite-plugin

### Svagheter

- **Inkonsekvent antal kalkylatorer:** index.html nämner 11, 15 och 22 på olika ställen (FAQ schema, meta, JSON-LD). Borde synkas med faktiskt antal.
- **Ingen sid-specifik titel/meta:** Alla sidor delar samma `<title>` och description — inget react-helmet eller liknande
- **Sitemap ofullständig:** `vite.config.ts` ROUTES saknar: `/rantabilitet`, `/aterbetalningstid`, `/brutto-fran-netto`, `/effektiv-ranta`, `/cagr`

### Rekommendationer

1. Synka antal kalkylatorer i index.html med `TOOL_GROUPS` / `config/calculators`
2. Lägg till `rantabilitet`, `aterbetalningstid`, `brutto-fran-netto`, `effektiv-ranta`, `cagr` i sitemap ROUTES
3. Överväg react-helmet-async för sid-specifika titlar och beskrivningar

---

## 8. Tillgänglighet — A-

### Styrkor

- **Skip-link:** "Hoppa till innehåll" till `#main-content`
- **Fokus:** `main` med `tabIndex={-1}` för programmatisk fokus
- **ARIA:** `aria-live="polite"`, `aria-label="Beräkningsresultat"` på resultat
- **Accordion:** `aria-expanded`, `aria-controls`, `role="region"`
- **ShareModal:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **InfoTooltip:** `aria-expanded`, `aria-controls`, `role="tooltip"`
- **useReducedMotion:** Accordion, ShareModal, InfoTooltip, KommunPicker, Catalog, Loneutveckling
- **Label–input:** `htmlFor`/`id` kopplingar
- **Touch:** Större range-thumb på `pointer: coarse`

### Svagheter

- **InfoTooltip:** Endast klick — ingen Enter/Space för tangentbord
- **Preset-knappar:** Vissa saknar `aria-label` (t.ex. EffektivRanta, FIRE-scenarier)
- **Fokus vid modalfokus:** ShareModal fokuserar inte första fokuserbara element vid öppning (endast input select)

### Rekommendationer

1. Lägg till `onKeyDown` (Enter/Space) i InfoTooltip
2. Lägg till `aria-label` på alla preset-/scenarioknappar
3. Överväg focus trap och fokus på stäng-knappen vid modal-öppning (beroende på UX-beslut)

---

## 9. Felhantering — B-

### Styrkor

- **Återbetalningstid:** Tydlig varning vid impossible (betalning ≤ ränta)
- **Procenträknare:** `Number.isFinite(result)` innan visning
- **FeedbackForm:** try/catch, felmeddelande, fallback till mailto

### Svagheter

- **Ingen Error Boundary:** React-fel i komponenter får inget fångat fel — hela appen kraschar
- **Indata:** Ogiltiga siffror clampas tyst — ingen tydlig feedback (t.ex. "Värdet anpassades till X")
- **Tomma inputs:** `value={loan || ''}` — kan vara otydligt för användaren varför fältet är tomt
- **FeedbackForm:** Ingen validering av e-postformat

### Rekommendationer

1. Lägg till `ErrorBoundary` runt `<Outlet />` i Layout
2. Överväg inline-validering eller tooltip vid clamp ("Värdet justerades till max X")
3. Validera e-post i FeedbackForm innan skick

---

## 10. Tester — F

### Status

- **Inga enhetstester:** Ingen Jest, Vitest eller liknande
- **Inga testfiler:** Inga `*.test.ts(x)` eller `*.spec.ts(x)` i src/
- **Ingen teststrategi:** Ingen dokumentation av testplan

### Rekommendationer

1. Lägg till Vitest
2. Börja med enhetstester för `lib/*`: `compoundInterest`, `bolanCalculations`, `effektivRantaCalculations`, `aterbetalningstidCalculations`
3. Lägg till tester för `parseInput`/`clamp`-logik om den centraliseras

---

## 11. Dokumentation — B

### Styrkor

- **README:** Start, AdSense, feedback, affiliate, deploy, SEO
- **`.env.example`:** Tydliga kommentarer för env-variabler
- **config/yearly.ts:** Instruktioner och källor för uppdateringar
- **JSDoc:** På viktiga beräkningsfunktioner

### Svagheter

- **Ingen CONTRIBUTING** eller arkitektur-dokumentation
- **Ingen formeldokumentation:** Beräkningsformler inte beskrivna separat
- **README:** Nämner "11 kalkylatorer" — bör uppdateras till aktuellt antal

### Rekommendationer

1. Skapa kort arkitekturoversikt (mappar, huvudsaklig dataflöde)
2. Uppdatera README med aktuellt antal kalkylatorer (eller referens till dynamisk källa)
3. Överväg FORMULAS.md eller liknande för transparens

---

## 12. Beroenden & konfiguration — B

### Nuvarande beroenden

| Paket | Version | Status |
|-------|---------|--------|
| react | ^18.2.0 | Stabil |
| react-router-dom | ^7.13.1 | Senaste |
| motion | ^12.34.3 | Senaste |
| recharts | ^2.10.3 | Stabil |
| vite | ^5.0.8 | Senaste |
| tailwindcss | ^3.4.0 | Stabil |
| typescript | ^5.3.2 | Senaste |

### Styrkor

- Liten, tydlig mängd beroenden
- Inga uppenbara sårbarheter (kör `npm audit` regelbundet)

### Svagheter

- **Sitemap ROUTES:** Hårdkodad i vite.config.ts — borde genereras från `ROUTES` i links.ts
- **Ingen lock-fil synlig i audit:** Verifiera att package-lock.json committas

### Rekommendationer

1. Generera sitemap ROUTES från `config/links.ts` istället för duplicering
2. Kör `npm audit` regelbundet
3. Överväg Dependabot eller Renovate för uppdateringar

---

## Prioriterade åtgärder

| Prioritet | Åtgärd | Status |
|-----------|--------|--------|
| ~~1. Kritisk~~ | ~~Inför tester (Vitest) för lib/*~~ | **KLAR** – Vitest + 18 tester |
| ~~2. Hög~~ | ~~Lazy-loada sidor (React.lazy + Suspense)~~ | **KLAR** – Sidor code-splittade |
| ~~3. Hög~~ | ~~Fixa sitemap — lägg till saknade routes~~ | **KLAR** – Datadriven från ROUTES |
| ~~4. Hög~~ | ~~Synka antal kalkylatorer i index.html~~ | **KLAR** – {{CALCULATOR_COUNT}} vid build |
| ~~5. Medel~~ | ~~Lägg till Error Boundary~~ | **KLAR** – ErrorBoundary i Layout |
| 6. Medel | Sid-specifika titlar (react-helmet-async) | Ej implementerat |
| 7. Låg | Centralisera URL-parametrar | Ej implementerat |
| 8. Låg | InfoTooltip tangentbordsstöd | Ej implementerat |

---

*Audit utförd genom kodgranskning. Uppdaterad efter implementering av prioriterade åtgärder.*
