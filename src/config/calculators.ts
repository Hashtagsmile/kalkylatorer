/**
 * Feature flags för kalkylatorer
 *
 * Styr vilka kalkylatorer som visas på startsidan och om de har beta-tagg.
 * Sätt enabled: false för att dölja (länken fungerar fortfarande vid direktbesök).
 * Sätt beta: true för nya kalkylatorer i första release.
 *
 * UPPDATERING: Ändra här när du vill släppa/dölja kalkylatorer.
 */

import { ROUTES } from './links'
import type { RouteId } from './links'

export interface CalculatorFlag {
  /** false = döljs från startsidan (men route fungerar vid direktlänk) */
  enabled: boolean
  /** true = visar "Beta" eller "Ny" på kortet – för första release */
  beta?: boolean
}

/** Feature flags per kalkylator. Nyckel = RouteId. */
export const CALCULATOR_FLAGS: Record<RouteId, CalculatorFlag> = {
  home: { enabled: true },
  om: { enabled: true },
  samarbeten: { enabled: false },
  rantapaRanta: { enabled: true },
  pensionskalkylator: { enabled: true },
  bolanekalkylator: { enabled: true },
  inflationskalkylator: { enabled: true },
  lonekalkylator: { enabled: true },
  csnKalkylator: { enabled: true },
  procentraknare: { enabled: true },
  momsraknare: { enabled: true },
  semesterersattning: { enabled: true },
  fireKalkylator: { enabled: true, beta: true },
  kalpKalkylator: { enabled: true, beta: true },
  egenkostnad: { enabled: true },
  timlon: { enabled: true },
  iskSkatt: { enabled: true },
  skatteaterbaring: { enabled: true },
  kontantinsats: { enabled: true },
  loneutveckling: { enabled: true },
  rantabilitet: { enabled: true },
  aterbetalningstid: { enabled: true },
  bruttoFranNetto: { enabled: true },
  effektivRanta: { enabled: true, beta: true },
  cagr: { enabled: true, beta: true },
}

/** Mappning href → RouteId för lookup */
const HREF_TO_ROUTE: Record<string, RouteId> = Object.fromEntries(
  (Object.entries(ROUTES) as [RouteId, string][]).map(([id, path]) => [path, id])
)

/** Hämta flagga för en kalkylator (via href). Default: enabled om ej konfigurerad. */
export function getCalculatorFlag(href: string): CalculatorFlag {
  const routeId = HREF_TO_ROUTE[href]
  const flag = routeId ? CALCULATOR_FLAGS[routeId] : undefined
  return flag ?? { enabled: true }
}

/** Är kalkylatorn aktiverad? */
export function isCalculatorEnabled(href: string): boolean {
  return getCalculatorFlag(href).enabled
}

/** Ska beta-tagg visas? */
export function isCalculatorBeta(href: string): boolean {
  return getCalculatorFlag(href).beta === true
}
