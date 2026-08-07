# Verifiering av källor – länkar och innehåll

*Senast verifierad: februari 2025*

**Alla externa URLs finns i `src/config/links.ts`** – uppdatera där vid trasiga länkar.

## Sammanfattning

| Källa | Status | Kommentar |
|-------|--------|-----------|
| UBS Global Investment Returns Yearbook | ✅ | Fungerar, 2025-utgåvan |
| Skatteverket – ISK | ✅ | Uppdaterad URL (gammal pekade på Arbetsgivaravgifter) |
| SCB | ⚠️ | Kan timeouta – huvudwebbplats |
| Sparränta.nu | ✅ | Fungerar |
| Rika Tillsammans | ✅ | Fungerar |
| Finansinspektionen | ✅ | Huvudsida fungerar |
| FI – Amorteringskrav | ✅ | Uppdaterad URL (gammal 404) |
| Riksbanken | ✅ | Fungerar |
| Riksbanken – Inflation | ✅ | Fungerar |
| Skatteverket (allmänt) | ✅ | Fungerar |
| Ekonomifakta | ✅ | Fungerar |
| CSN – Ränta och avgifter | ✅ | Fungerar, innehåll stämmer |
| CSN – Betala tillbaka | ✅ | Fungerar |
| CSN – Våra olika lån | ✅ | Fungerar |
| Pensionsmyndigheten | ✅ | Fungerar |
| Pensionsmyndigheten – Så beräknas pension | ✅ | Fungerar |
| Pensionsmyndigheten – Riktålder | ✅ | Uppdaterad URL (gammal 404) |

## Uppdaterade URLs (februari 2025)

1. **Skatteverket ISK**  
   - Gammal (fel): `.../pengarochforemal/isk.4.233f91f...` → Arbetsgivaravgifter  
   - Ny: `.../vardepapper/investeringssparkontoisk.4.5fc8c945...`

2. **FI Amorteringskrav**  
   - Gammal (404): `.../sv/regler/amorteringskrav`  
   - Ny: `.../sv/for-konsumenter/hushallens-lan/foreskrifter-om-amorteringskrav/`

3. **Pensionsmyndigheten Riktålder**  
   - Gammal (404): `.../forsta-din-pension/nar-kan-du-ga-i-pension/riktalder-och-pensionsaldrar`  
   - Ny: `.../ga-i-pension/planera-din-pension/pensionsaldrar-och-riktalder`

## Årlig kontroll

Kör verifiering årligen (jan–feb) tillsammans med uppdatering av `config/yearly.ts`.
