/**
 * AdSense-konfiguration
 *
 * När du fått godkänd av Google AdSense:
 * 1. Skapa annonsenheter i AdSense (responsiv display)
 * 2. Fyll i värdena nedan
 * 3. Avkommentera script-taggen i index.html med ditt client ID
 */

export const adsense = {
  /** Ditt AdSense client ID (t.ex. ca-pub-1234567890123456) */
  client: import.meta.env.VITE_ADSENSE_CLIENT || '',
  /** Annonsenhet för top-banner */
  slotTop: import.meta.env.VITE_ADSENSE_SLOT_TOP || '',
  /** Annonsenhet för mitten */
  slotMiddle: import.meta.env.VITE_ADSENSE_SLOT_MIDDLE || '',
  /** Annonsenhet för botten */
  slotBottom: import.meta.env.VITE_ADSENSE_SLOT_BOTTOM || '',
}

export const isAdSenseEnabled = Boolean(adsense.client)

/**
 * Kontakt för feedback och felrapporter
 * Sätt VITE_CONTACT_EMAIL i .env (t.ex. feedback@din-domän.se)
 * Om tomt visas inte feedback-länken i footern.
 */
export const contact = {
  /** E-post för förbättringsförslag och felrapporter */
  email: import.meta.env.VITE_CONTACT_EMAIL || '',
  /** E-post för affiliate-/samarbetsförfrågningar. Fallback till email om ej satt. */
  partnershipEmail: import.meta.env.VITE_PARTNERSHIP_EMAIL || import.meta.env.VITE_CONTACT_EMAIL || '',
  /** GitHub-repo för issues (t.ex. "användare/repo"). Visar "Rapportera på GitHub" om satt. */
  githubRepo: import.meta.env.VITE_GITHUB_REPO || '',
}

/**
 * Affiliate-länkar – fyll i när du har partnerskap
 * Använd rel="nofollow sponsored" för affiliate
 */
export const affiliate = {
  /** ISK / fondsparande (t.ex. Avanza, Nordea) */
  isk: import.meta.env.VITE_AFFILIATE_ISK || '',
  /** Sparkonto-jämförelse */
  sparkonto: import.meta.env.VITE_AFFILIATE_SPARKONTO || '',
  /** Pensionssparande */
  pension: import.meta.env.VITE_AFFILIATE_PENSION || '',
}
