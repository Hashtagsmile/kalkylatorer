# Kalkylatorer

Gratis ekonomikalkylatorer för sparande, pension, bolån, lön och mer. Alla beräkningar sker lokalt i webbläsaren – ingen registrering krävs.

## Översikt

- **22+ kalkylatorer** inom sparande (ränta på ränta, FIRE, ISK-skatt), bostad (bolån, kontantinsats, KALP), lön (nettolön, egenkostnad, timlön) och enkla verktyg (procent, moms, inflation)
- **Datadriven arkitektur** – länkar, routes, feature flags och innehåll styrs via konfiguration
- **Anpassad för Sverige** – kommunalskatt, CSN, pensionssystem, moms, FI:s amorteringskrav
- **SEO-optimerad** – JSON-LD, meta tags, Open Graph, sitemap

## Kom igång

```bash
cd passiv-inkomst
npm install
npm run dev
```

Öppna http://localhost:5173

## Projektstruktur

```
src/
├── config/          # Konfiguration – single source of truth
│   ├── links.ts     # ROUTES, externa länkar (myndigheter, källor)
│   ├── calculators.ts  # Feature flags per kalkylator (enabled, beta)
│   ├── site.ts     # Sitenamn, slogan, introtext
│   └── yearly.ts   # Årliga siffror (skatt, CSN, pension, ISK)
├── data/            # Statisk data
│   ├── calculatorInfo.ts  # FAQ, fakta, ordlista, källor per kalkylator
│   ├── municipalities.ts  # Kommuners skattesatser
│   └── fireScenarios.ts  # FIRE-scenarier
├── lib/             # Beräkningslogik (ren funktionalitet)
├── components/      # Återanvändbara UI-komponenter
└── pages/           # Sidor (kalkylatorsidor, Catalog, Om)
```

**Viktigt:** Nya kalkylatorer, länkar och innehåll läggs till via **config** och **data** – inte genom att hårdkoda i komponenter.

## Konfiguration

### Ny kalkylator

1. Lägg till route i `config/links.ts` (ROUTES)
2. Lägg till flagga i `config/calculators.ts` (CALCULATOR_FLAGS)
3. Lägg till i `TOOL_GROUPS` i `src/pages/Catalog.tsx`
4. Lägg till info i `data/calculatorInfo.ts` (för CalculatorInfoSection)
5. Skapa sida i `src/pages/` och lägg till route i `App.tsx`
6. Lägg till path i `vite.config.ts` ROUTES (för sitemap)

### Årliga uppdateringar

Se `config/yearly.ts` – uppdatera skatt, CSN, pension, ISK etc. årligen (jan–feb). Källor anges i filen.

### Miljövariabler

Kopiera `.env.example` till `.env.local` och fyll i:

- **VITE_SITE_URL** – din domän (SEO, canonical, sitemap)
- **VITE_ADSENSE_CLIENT** – AdSense client ID (när godkänd)
- **VITE_ADSENSE_SLOT_TOP/MIDDLE/BOTTOM** – slot IDs för annonser
- **VITE_CONTACT_EMAIL** – aktiverar feedbackformulär (FormSubmit.co), eller
- **VITE_GITHUB_REPO** – visar "Rapportera på GitHub"
- **VITE_AFFILIATE_ISK**, **VITE_AFFILIATE_SPARKONTO**, **VITE_AFFILIATE_PENSION** – affiliate-länkar (valfritt)

## Deploy

```bash
VITE_SITE_URL=https://din-domän.se npm run build
```

Deploya `dist/` till Vercel, Netlify eller liknande. Sätt miljövariablerna i deras dashboard.

## Teknisk stack

- React 18 + TypeScript
- Vite (build & dev)
- React Router 7
- Tailwind CSS
- Motion (animationer, med useReducedMotion)
- Recharts (grafer)

## AdSense

1. Sök till Google AdSense när du har ~1000 besökare/månad
2. Fyll i client ID och slot IDs i `.env.local`
3. Bygg och deploya – annonser visas automatiskt på kalkylatorsidor

## SEO

- Strukturerad data (JSON-LD) för WebApplication, FAQ, HowTo
- Meta tags, Open Graph, Twitter Cards
- Canonical och OG-URL:er ersätts vid build via VITE_SITE_URL
- Sitemap och robots.txt genereras vid build

## Källor

Alla beräkningar bygger på officiella källor: Skatteverket, CSN, Pensionsmyndigheten, Finansinspektionen, Riksbanken, SCB. Källor anges i `config/links.ts` och `data/calculatorInfo.ts`.
