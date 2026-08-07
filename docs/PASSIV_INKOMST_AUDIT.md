# Passiv inkomst – Audit & Projektioner

*Kalkylatorer – 6 gratis verktyg för sparande, pension, bolån, lön, CSN och inflation*

---

## 1. Nuvarande monetiseringssetup

| Källa | Status | Konfiguration |
|-------|--------|---------------|
| **Google AdSense** | Redo | 3 platser (top, middle, bottom) |
| **Affiliate** | Redo | ISK, sparkonto, pension – env-konfig |
| **FormSubmit** | Redo | Feedback utan backend |

**Arbetsinsats för att aktivera:** ~2–4 timmar (domän, AdSense-ansökan, affiliate-konton)

---

## 2. Intäktsprojektioner – realistiska scenarier

### AdSense (displayannonser)

| Besökare/månad | Sidvisningar* | CPM (finans)** | Månadsintäkt |
|----------------|--------------|----------------|--------------|
| 1 000 | ~3 000 | 40 kr | ~120 kr |
| 5 000 | ~15 000 | 40 kr | ~600 kr |
| 10 000 | ~30 000 | 40 kr | ~1 200 kr |
| 25 000 | ~75 000 | 40 kr | ~3 000 kr |
| 50 000 | ~150 000 | 40 kr | ~6 000 kr |

\* ~3 sidvisningar per besök (startsida + 1–2 kalkylatorer)  
\** Finans-nisch har högre CPM än allmänt innehåll. Sverige: ~30–50 kr CPM för finans.

### Affiliate (ISK, sparkonto, pension)

| Konvertering | Besökare/månad | Signups | Provision* | Månadsintäkt |
|--------------|----------------|---------|------------|--------------|
| 0,5 % | 5 000 | 25 | 100 kr/st | ~2 500 kr |
| 0,5 % | 10 000 | 50 | 100 kr/st | ~5 000 kr |
| 1 % | 10 000 | 100 | 100 kr/st | ~10 000 kr |

\* ISK/konto: 50–200 kr CPA. Sparkonto: 20–80 kr. Pension: 100–300 kr. Snitt ~100 kr används.

### Kombinerat – tre scenarier

| Scenario | Månad 6 | Månad 12 | Arbete/månad |
|----------|---------|----------|--------------|
| **Konservativt** | 500 kr (AdSense) | 1 500 kr (AdSense + lite affiliate) | 1–2 h |
| **Rimligt** | 2 000 kr | 5 000 kr | 2–4 h |
| **Optimistiskt** | 5 000 kr | 15 000 kr | 4–8 h |

---

## 3. Vad krävs för passiv inkomst?

### Minimi (låg trafik)

1. **Deploy** – Vercel/Netlify (gratis)
2. **Domän** – kalkylatorer.se eller liknande (~100 kr/år)
3. **AdSense** – ansök när du har ~500–1000 besökare
4. **Vänta** – 3–6 månader för indexering och rankingar

**Arbete:** ~4 timmar initialt, sedan <1 h/månad (uppdatera siffror årligen)

### För högre intäkter

5. **Affiliate** – Awin, Adrecord, eller direktavtal (Avanza, Nordea, Lysa)
6. **Fler sidor** – "Bästa ISK 2025", "Så fungerar amorteringskrav" – fler sökord
7. **Backlinks** – nämn i forum, Reddit, LinkedIn
8. **E-post** – nyhetsbrev med sparande-tips → affiliate i mailet

---

## 4. Tidslinje – realistisk

| Månad | Förväntat | Åtgärd |
|-------|-----------|--------|
| 0 | Deploy, domän | Sätt live |
| 1–2 | 50–200 besökare | Indexering, första rankingar |
| 3–4 | 200–500 besökare | Sök AdSense |
| 5–6 | 500–2000 besökare | AdSense godkänd, första intäkter |
| 7–12 | 2000–10000 besökare | Affiliate aktiverad, skala upp |

**Första meningsfulla intäkter (500+ kr/mån):** 6–9 månader  
**Passiv 2000+ kr/mån:** 12–18 månader (med lite påverkan)

---

## 5. Konkurrens & differentiering

**Konkurrenter:** MinKalkylator.se, Kalkylerat.se, Swedbank, Avanza, Rika Tillsammans

**Din fördel:**
- 6 kalkylatorer på en plats – bra för "kalkylatorer" som sökord
- Ren UX, ingen säljagenda
- Evergreen – formler ändras sällan
- Svenskt – mindre konkurrens än engelska

**Sökord med potential:** "bolånekalkylator", "pensionskalkylator", "nettolön kalkylator", "CSN återbetalning", "ränta på ränta"

---

## 6. Rekommenderade nästa steg (prioritet)

1. **Deploy + domän** – Sätt live, VITE_SITE_URL, canonical
2. **AdSense** – Ansök när du har trafik
3. **Affiliate** – Awin/Adrecord, sätt VITE_AFFILIATE_* i .env
4. **1–2 extra sidor** – "Bästa ISK 2025" (affiliate-fokus), "Så fungerar amorteringskrav"
5. **Backlinks** – Flashback privat ekonomi, Reddit r/privatekonomi, LinkedIn

---

## 7. Sammanfattning

| Fråga | Svar |
|-------|------|
| **Kan detta tjäna pengar passivt?** | Ja – AdSense + affiliate |
| **Hur mycket arbete?** | 4–8 h initialt, 1–4 h/månad |
| **Realistisk intäkt år 1?** | 500–5 000 kr/mån (beroende på trafik) |
| **Vad är flaskhalsen?** | Trafik – kräver SEO, tid, eventuellt backlinks |
| **Risk?** | Låg – ingen investering, minimal underhållskostnad |

**Slutsats:** Projektet är välbyggt för passiv inkomst. Den största faktorn är trafik – men med 6 kalkylatorer och bra SEO är potentialen god. Förvänta dig inte snabb ROI, men underhållet är minimalt och intäkterna kan växa över 12–24 månader.

---

## 8. Accordion-animation & animeringspaket

### Accordion
Accordionerna har nu mjuk öppning/stängning via ren CSS (`grid-template-rows: 0fr` → `1fr`). Ingen extra paket behövs.

### Animeringspaket – rekommendation
**Behöver du inte installera något** för nuvarande behov. Tailwind + CSS räcker för:
- Accordion (implementerat)
- Hover-effekter
- Fade-in på sidladdning (finns i tailwind.config)

**Framer Motion** (~45 kb gzipped) är bra om du senare vill ha:
- Sidövergångar
- Stagger-animationer för listor
- Komplexa layout-animationer

**Rekommendation:** Hoppa över paket tills du har ett konkret behov. Ren CSS håller bundle-storleken nere och prestandan uppe.
