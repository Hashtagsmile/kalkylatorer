# Verifiering av fakta – RäntaPåRänta

*Research genomförd februari 2025*

---

## 1. Ränta-på-ränta-formeln ✓ KORREKT

**Vår implementation:** Månatlig ränta, insättningar i slutet av varje månad.

```
total = total × (1 + r/12) + monthly
```

**Standardformel (FV med månatliga insättningar):**
```
FV = P(1 + r/12)^(12t) + PMT × [((1 + r/12)^(12t) - 1) / (r/12)]
```

Vår iterativa metod ger samma resultat. ✓

---

## 2. Historisk avkastning 7% ✓ MED NYANS

**Källor:** UBS Global Investment Returns Yearbook, NBER, Rika Tillsammans

- **7%** avser ofta **nominell** avkastning (före inflation)
- **Real avkastning** (efter inflation): cirka 3,5–5% globalt långsiktigt
- **Sverige:** Stockholmsbörsen ~9% nominellt sedan 1870, ~13% sedan 1984
- **Globala indexfonder** (senaste 5 år): 14–15% årligen – men kort period

**Slutsats:** 7% är en ofta använd, konservativ skattning för långsiktig planering. Korrekt att använda, men bör förtydligas att det är nominell avkastning och att inga garantier finns.

---

## 3. Sparräntor 2–4% ✓ KORREKT

**Källor:** Sparränta.nu, 2024–2025

- Högsta sparränta utan bindning: **3,30%**
- Typiska banker: **0,8–2,75%**
- Med bindning: upp till **5,5%**

**Slutsats:** 2–4% för sparräntor är korrekt. ✓

---

## 4. CSN / Studiebidrag (scenario Studerande) ✓ UPPDATERAT

**Källor:** CSN.se, Omni 2025

- **Heltid:** 13 500 kr/månad totalt (bidrag ~4 092 kr + lån ~9 408 kr)
- **Bidragsdel:** cirka 4 000 kr
- **Sparande 1 000 kr/mån:** motsvarar ~25% av bidragsdel – rimligt för en sparsam student

**Slutsats:** 1 000 kr/mån är realistiskt. Beskrivningen uppdaterad till "en del av studiebidraget". ✓

---

## 5. Ingångslön / Första jobbet (3 500 kr sparande) ✓ KORREKT

**Källor:** Ekonomifakta, Sveriges Ingenjörer 2024

- **Civilingenjör:** 40–44k/månad
- **Lärare:** 33–39k/månad
- **Handel/lager:** 25–28k/månad
- **10% av ~35 000 kr** = 3 500 kr

**Slutsats:** 3 500 kr som ~10% av typisk ingångslön är korrekt. ✓

---

## 6. ISK och kapitalförsäkring ✓ KORREKT

**Källor:** Strivo, SPP, Lannebo 2025–2026

- ISK och kapitalförsäkring är skatteeffektiva i Sverige
- Skattefritt belopp höjs till 300 000 kr 2026
- Rekommenderas för långsiktigt sparande

**Slutsats:** Tipset stämmer. ✓

---

## 7. Exempel 10 000 kr → 10 700 kr ✓ KORREKT

10 000 × 1,07 = 10 700 kr efter ett år. ✓

---

## 8. Rekommendationer

| Område | Åtgärd |
|--------|--------|
| Tooltip avkastning | Lägg till att 7% är nominell avkastning |
| Scenario Studerande | Förtydliga att det gäller bidragsdel av CSN |
| SeoContent "5–7%" | Behåll – täcker både konservativ och typisk skattning |
