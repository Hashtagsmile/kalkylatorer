# Launch-checklista – Steg för steg före deploy

Använd denna lista innan du lanserar sidan. Kryssa av när du är klar.

---

## 1. Domän & hosting

- [ ] **Domän** – Har du en domän? (t.ex. kalkylatorer.se, minasidor.se)
- [ ] **Hosting** – Vercel, Netlify eller liknande valt (Vercel/Netlify har gratis tier)
- [ ] **SSL** – HTTPS aktiveras automatiskt på Vercel/Netlify
- [ ] **DNS** – Domänen pekar på hosting (CNAME eller A-record)

---

## 2. Miljövariabler (.env)

Skapa `.env` (eller `.env.production`) och sätt:

### Obligatoriskt

- [ ] **VITE_SITE_URL** – Din riktiga domän, t.ex. `https://kalkylatorer.se`  
  - Används för canonical, OG-URL:er, sitemap – **kritiskt för SEO**

### Starkt rekommenderat

- [ ] **VITE_CONTACT_EMAIL** – E-post för feedback (FormSubmit.co skickar hit)  
  - Aktiverar feedbackformulär på Om-sidan och footern  
  - Alternativt: **VITE_GITHUB_REPO** (t.ex. `användare/repo`) för GitHub Issues

### Vid behov

- [ ] **VITE_PARTNERSHIP_EMAIL** – Separat e-post för samarbeten (annars används VITE_CONTACT_EMAIL)
- [ ] **VITE_ADSENSE_CLIENT** – När AdSense är godkänd
- [ ] **VITE_ADSENSE_SLOT_TOP** / **VITE_ADSENSE_SLOT_MIDDLE** / **VITE_ADSENSE_SLOT_BOTTOM** – Annonsenheter
- [ ] **VITE_AFFILIATE_ISK** / **VITE_AFFILIATE_SPARKONTO** / **VITE_AFFILIATE_PENSION** – Affiliate-länkar när du har partnerskap

---

## 3. Konfiguration

- [ ] **Sitenamn** – Kontrollera `src/config/site.ts` att `SITE.name`, `slogan` stämmer
- [ ] **Integritetspolicy** – Uppdatera `public/privacy.html` med din verksamhet, cookie-info, kontaktuppgifter
- [ ] **Årliga siffror** – Kontrollera `src/config/yearly.ts` (skatt, CSN, pension, ISK m.m.) – uppdateras typiskt jan–feb varje år

---

## 4. Build & test lokalt

```bash
VITE_SITE_URL=https://din-domän.se npm run build
```

- [ ] **Build lyckas** – Inga fel vid `npm run build`
- [ ] **Preview** – Kör `npm run preview` och testa lokalt
- [ ] **Viktiga flöden** – Testa minst: startsida, en kalkylator (t.ex. bolån), Om-sidan, Samarbeten, Feedback
- [ ] **Mobil** – Kolla att layouten fungerar på smal skärm
- [ ] **Utskrift** – Testa "Skriv ut resultat" på en kalkylator

---

## 5. SEO & metadata

- [ ] **index.html** – `{{SITE_URL}}` och `{{CALCULATOR_COUNT}}` ersätts vid build (automatiskt via vite.config)
- [ ] **dist/ efter build** – Verifiera att `sitemap.xml` och `robots.txt` skapas i `dist/`
- [ ] **dist/index.html** – Canonical, OG-URL:er ska visa din riktiga domän (inte example.com)

---

## 6. Hosting-konfiguration (Vercel/Netlify)

- [ ] **Build-kommando** – `npm run build` (ofta auto-detekterat)
- [ ] **Output-mapp** – `dist`
- [ ] **Miljövariabler** – Lägg in VITE_SITE_URL, VITE_CONTACT_EMAIL (etc.) i hosting-dashboard
- [ ] **Node-version** – 18+ (Vercel/Netlify brukar ha rätt default)

### Vercel (Så här)

1. New Project → Importera repo
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables: Lägg till VITE_SITE_URL, VITE_CONTACT_EMAIL m.fl.
5. Deploy

### Netlify (Så här)

1. Add new site → Import from Git
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: VITE_SITE_URL, VITE_CONTACT_EMAIL m.fl.
5. Deploy

---

## 7. Efter deploy

- [ ] **https://din-domän.se** – Laddas sidan korrekt?
- [ ] **https://din-domän.se/sitemap.xml** – Visas sitemap?
- [ ] **https://din-domän.se/robots.txt** – Visas robots?
- [ ] **https://din-domän.se/privacy.html** – Fungerar integritetspolicy-länken?
- [ ] **Google Search Console** – Skicka in sitemap: `https://din-domän.se/sitemap.xml`
- [ ] **Feedback** – Testa att skicka ett testmeddelande via feedbackformuläret (Om-sidan)

---

## 8. Ytterligare (valfritt, kan göras senare)

- [ ] **Google AdSense** – Ansök när du har trafik (ofta krav ~1000 besök/mån)
- [ ] **AdSense-script** – Avkommentera i `index.html` och lägg in client ID när godkänd
- [ ] **Affiliate** – Sök till TradeDoubler, AWIN, Adrecord eller direkt till banker/fintech
- [ ] **Analytics** – Lägg till Google Analytics/Microsoft Clarity om du vill mäta trafik (kräver cookiebanner/integritetstext)

---

## Snabbkommando för build med domän

```bash
VITE_SITE_URL=https://din-domän.se npm run build
```

eller sätt `VITE_SITE_URL` permanent i `.env` och kör bara `npm run build`.

---

**Lycka till med lanseringen.**
