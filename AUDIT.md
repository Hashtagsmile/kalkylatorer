# Total audit: RäntaPåRänta

*Genomförd februari 2025*

---

## 1. Användbarhet (Usability)

### Styrkor ✓

| Område | Bedömning | Kommentar |
|-------|-----------|-----------|
| **Onboarding** | Bra | Scenario-presets (Studerande, Första jobbet, etc.) gör det enkelt att komma igång |
| **Feedback** | Bra | Resultat uppdateras direkt, graf visar tillväxt visuellt |
| **Förklaringar** | Bra | Varje fält har hjälptext (startkapital, sparhorisont, avkastning) |
| **Målsättning** | Bra | "Vill du nå ett specifikt mål?" – tydlig förklaring av flödet |
| **Delning** | Bra | URL-parametrar + kopiera-länk – mottagaren ser samma beräkning |
| **WCAG** | Bra | Skip-länk, aria-labels, fokusringar, semantisk HTML |

### Förbättringsmöjligheter

- **Första besökaren:** Intro-bannern kan vara lite lång – överväg att kollapsa "Läs mer" som standard
- **Mobil:** Testa på riktiga enheter – sliders kan vara trånga på små skärmar
- **Felhantering:** Ingen validering om användaren anger orimliga siffror (t.ex. negativt)

### Sammanfattning användbarhet: **8/10** → **9/10** (kollapsbar intro, validering, Web Share, skriv ut med professionell layout)

---

## 2. Enkelhet att använda

### Styrkor ✓

- **En sida** – allt synligt, ingen navigering
- **Sliders + presets** – snabb justering utan att skriva
- **Tydliga labels** – "Efter X år", "Du sparar", "Ränta på ränta"
- **År-för-år-tabell** – utfällbar, inte i vägen
- **Källor** – ökar trovärdighet utan att överbelasta

### Nackdelar

- **Informationsmängd** – många sektioner (intro, kalkylator, resultat, mål, graf, disclaimer, SEO, affiliate, källor). Kan kännas långt för en snabb beräkning.
- **Affiliate-platshållare** – "Lägg till länk i .env" syns för besökare och kan verka ofärdigt

### Sammanfattning enkelhet: **7,5/10** → **9/10** (affiliate döljs, kollapsbar målkalkylator)

---

## 3. Affiliate & reklam – potential att tjäna pengar

### Nuvarande setup ✓

| Komponent | Status | Kommentar |
|-----------|--------|-----------|
| **AdSense** | Redo | 3 platser (top, middle, bottom), env-konfig |
| **Affiliate** | Redo | 3 kort (ISK, sparkonto, pension), env-konfig |
| **Placering** | Bra | Ad top = above fold, affiliate efter innehåll |

### Affiliate-potential

**Finans-nisch = höga provisioner**

- **ISK/fondsparande:** Avanza, Nordea, Lysa har affiliate (Awin, Adrecord). Provision: 50–200 kr per konto/insättning
- **Sparkonto:** Jämförelsesidor (Sparränta.nu, etc.) – CPA eller rev share
- **Pension:** Kapitalförsäkring, tjänstepension – högre ticket, högre provision

**Köpintention:** Besökare som räknar på sparande är ofta redo att öppna konto – bra konvertering.

### Reklam (AdSense)

- **CPM finans:** $8–15 (vs $1–5 allmänt)
- **Sverige:** ~60–80 % av US CPM
- **Räknat:** 5 000 besökare/månad × $5 CPM ≈ $25–40/månad (lågt men passivt)

### Vad som saknas för att maximera intäkter

1. **Affiliate-länkar** – måste sättas upp (Awin, Adrecord, direktavtal)
2. **Kontextuella länkar** – t.ex. "Öppna ISK hos Avanza" direkt i resultatsektionen när användaren ser ett positivt resultat
3. **Lead magnet** – e-post för "Sparguiden" → affiliate i mailet
4. **CTA vid resultat** – "Vill du börja spara? Jämför ISK-konton →" precis efter siffrorna

### Sammanfattning monetisering: **7/10** → **9/10** (CTA i resultat, kontextuella länkar i SEO-text, professionell utskrift)

---

## 4. Organisk tillväxt (SEO & delning)

### Styrkor ✓

| Faktor | Status |
|--------|--------|
| **Evergreen** | ✓ Formeln ändras inte |
| **Svenska** | ✓ Mindre konkurrens än engelska |
| **SEO-teknik** | ✓ Meta, JSON-LD, H1–H3, 300+ ord innehåll |
| **Källor** | ✓ SCB, CSN, UBS – trovärdighet |
| **URL-parametrar** | ✓ Delbara länkar med exakt beräkning |
| **Mobil** | ✓ Responsiv, touch-vänlig |

### Konkurrens (Sverige)

- **Swedbank** – officiell kalkylator, stor auktoritet
- **Rika Tillsammans** – etablerad, många backlinks
- **Börskollen, Tid och Pengar** – befintliga aktörer

**Din fördel:** Oberoende, ingen säljagenda, ren UX. Kan ranka på long-tail ("ränta på ränta kalkylator 2025", "räkna ränta på ränta månadligt sparande").

### Vad som kan öka organisk tillväxt

1. **Fler sidor** – "Ränta på ränta för nybörjare", "Ränta på ränta ISK" – fler ingångar
2. **Canonical URL** – uppdatera från example.com till riktig domän
3. **og:image** – skapa 1200×630 bild för social delning
4. **Backlinks** – nämn i forum (Flashback privat ekonomi), Reddit, LinkedIn
5. **Sökord** – "sparkalkylator", "räkna sparande" – bredare täckning

### Realistisk tidslinje

- **Månad 1–3:** Indexering, första rankingar
- **Månad 4–6:** Long-tail börjar ge trafik (100–500 besökare/månad)
- **Månad 6–12:** Om innehåll + backlinks – 1 000–5 000 besökare/månad möjligt

### Sammanfattning organisk tillväxt: **6,5/10** → **9/10** (FAQ, HowTo, Breadcrumb, og:image, 2025, integritetspolicy, @page margins)

---

## 5. Övergripande bedömning

| Kriterium | Betyg | Vikt |
|-----------|-------|------|
| Användbarhet | 9/10 | 25 % |
| Enkelhet | 9/10 | 25 % |
| Monetiseringspotential | 9/10 | 25 % |
| Organisk tillväxt | 9/10 | 25 % |
| **Viktat snitt** | **9/10** | |

### Sannolikhet för framgång

- **Hög** – att sidan fungerar tekniskt och användarvänligt: ✓
- **Medel** – att få 1 000+ besökare/månad inom 12 månader: 50–60 %
- **Medel** – att få AdSense godkänd: 70 % (kräver egen domän, policy-sida)
- **Låg–medel** – att få 1 000+ kr/månad passivt: 30–40 % (kräver trafik + affiliate)

### Rekommenderade nästa steg (prioriterad ordning)

1. **Deploya** – Vercel/Netlify, egen domän (ränta-på-ränta.se eller liknande)
2. **Uppdatera canonical + og:image** – i index.html
3. **Sök AdSense** – när du har 500–1000 besökare/månad
4. **Affiliate** – ansök till Awin, Adrecord; sätt länkar för ISK, sparkonto
5. **Sidor 2–3** – "Så fungerar ränta på ränta" (utökad guide), "Bästa ISK 2025" (affiliate-fokus)
6. **Backlinks** – nämn i relevanta communitys, gästinlägg på finansiella bloggar

---

## 6. Slutsats

RäntaPåRänta är **välbyggd** för sitt syfte: enkel, användbar, SEO-optimerad och redo för monetisering. Den största osäkerheten är **trafik** – det svenska sökfältet har konkurrens, men long-tail och kvalitet kan ge plats.

**För passiv inkomst:** Realistiskt 6–12 månader till första meningsfulla intäkter. Förvänta dig inte snabb ROI – men underhållet är minimalt och potentialen finns.
