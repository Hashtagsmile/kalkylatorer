# AGENTS.md – Riktlinjer för AI-agenter och utvecklare

Riktlinjer för hur detta projekt byggs och underhålls. Följ dessa principer vid nya features, refaktoreringar och beslut.

---

## 1. Datadrivna beslut

**Alla tillägg och ändringar ska vara datadrivna.** Konfiguration och data styrs centralt – komponenter ska inte innehålla hårdkodade listor, länkar eller beslut som kan flyttas till config/data.

### Regler

1. **Ny kalkylator:** Lägg till i `config/links.ts` (ROUTES), `config/calculators.ts` (CALCULATOR_FLAGS), `Catalog.tsx` (TOOL_GROUPS), `data/calculatorInfo.ts`, `App.tsx` och `vite.config.ts` (sitemap ROUTES). Skapa sidkomponent i `pages/`.

2. **Ny länk/route:** Endast i `config/links.ts`. Använd `resolveUrl()` eller `ROUTES`/`LINKS` – aldrig hårdkodade strängar i komponenter.

3. **Ny feature flag / synlighet:** I `config/calculators.ts`. `enabled` styr om kalkylatorn visas på Catalog; `beta` styr "Ny"-tagg.

4. **Innehåll (FAQ, fakta, källor):** I `data/calculatorInfo.ts`. `CalculatorInfoSection` hämtar data därifrån – inget innehåll i sidkomponenter.

5. **Årliga siffror:** I `config/yearly.ts`. Skatt, CSN, pension, ISK, etc. – aldrig hårdkodade i beräkningslogik.

6. **Sitenamn, slogan, intro:** I `config/site.ts`. Catalog-anatalet räknas dynamiskt från TOOL_GROUPS + `isCalculatorEnabled`.

### Undvik

- Hårdkodade länkar eller routes i komponenter
- Duplicerade listor (t.ex. sitemap ska kunna genereras från ROUTES/TOOL_GROUPS)
- Innehåll direkt i sidor som tillhör CalculatorInfo (använd calculatorInfo)
- Magic numbers i beräkningar – använd konstanter från yearly.ts eller config

---

## 2. Mappstruktur och plats för kod

| Vad | Var |
|-----|-----|
| Routes, externa länkar | `config/links.ts` |
| Feature flags (enabled, beta) | `config/calculators.ts` |
| Sitenamn, slogan | `config/site.ts` |
| Årliga siffror (skatt, CSN, etc.) | `config/yearly.ts` |
| FAQ, fakta, ordlista, källor | `data/calculatorInfo.ts` |
| Beräkningslogik (pure functions) | `lib/*.ts` |
| Återanvändbara UI-komponenter | `components/` |
| Sidor | `pages/` |

Beräkningslogik ska vara **pure** (inga side effects, inga React-imports). Testa gärna med enhetstester.

---

## 3. Tillgänglighet

- Använd `useReducedMotion()` från Motion vid animationer
- Skip-link till `#main-content`
- `aria-label` på knappar utan synlig text (preset, scenarier)
- `aria-expanded`, `aria-controls` på accordions, tooltips, modaler
- Label–input koppling (`htmlFor`/`id`)

---

## 4. SEO

- Antal kalkylatorer ska vara konsekvent – använd dynamiskt beräknat antal där det går
- Sitemap ROUTES i vite.config.ts ska matcha alla publicerade sidor (generera gärna från config)
- Sid-specifika titlar och meta (om implementerat) via react-helmet eller liknande

---

## 5. Stil och UI

- Tailwind – undvik inline styles
- Motion för animationer (accordion, modal, tooltip, dropdown)
- Konsekvent färgpalett: stone för neutralt, emerald/forest för accent
- `CalculatorPageHeader` och `ResultActions` för enhetligt utseende på kalkylatorsidor

---

## 6. Säkerhet

- Ingen `dangerouslySetInnerHTML`, `eval` eller liknande
- URL-parametrar valideras (parseFloat, isNaN, min/max clamp)
- Env-variabler endast via `import.meta.env.VITE_*`

---

## 7. Prestanda

- Överväg `React.lazy` + `Suspense` för sidor
- Recharts kan lazy-loadas där den används
- Undvik onödig re-render – memoization där det ger värde

---

## 8. Checklista vid ny kalkylator

- [ ] Route i `config/links.ts`
- [ ] Flagga i `config/calculators.ts`
- [ ] Entry i `CATALOG_GROUPS` (config/catalog.ts)
- [ ] Info i `data/calculatorInfo.ts`
- [ ] Sidkomponent + route i App.tsx
- [ ] Path i sitemap (vite.config.ts)
- [ ] Beräkningslogik i `lib/` om det behövs
- [ ] Källor och källor dokumenterade i calculatorInfo

---

## 9. Vid osäkerhet

- **Plats för ny kod:** Följ mappstrukturen ovan. Vid tveksamheter – fråga eller skapa en issue.
- **Datakälla:** Om något kan ändras utan att röra komponenter – flytta till config/data.
- **Källor:** Nya beräkningar ska ha referenser i calculatorInfo eller i lib-kommentarer.
