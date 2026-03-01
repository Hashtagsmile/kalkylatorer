/**
 * Nettolöneberäkning – förenklad modell
 * Kommunalskatt + statlig skatt + grundavdrag + jobbskatteavdrag (approximation)
 * Källor: Skatteverket, RESEARCH_BOLAN_INFLATION_LON_CSN.md
 * Årliga värden: config/yearly.ts
 */

import { TAX } from '../config/yearly'

const STATLIG_SKATTESATS = 0.20

/** Grundavdrag – förenklad, baserat på prisbasbelopp */
function grundavdrag(annualIncome: number): number {
  if (annualIncome <= 0) return 0
  const pb = TAX.prisbasbelopp
  if (annualIncome >= 2.07 * pb) return 0
  if (annualIncome >= 0.99 * pb) {
    return Math.max(0, 0.423 * pb - (0.423 * pb / (1.08 * pb)) * (annualIncome - 0.99 * pb))
  }
  return 0.423 * pb
}

/** Jobbskatteavdrag – förenklad approximation */
function jobbskatteavdrag(annualIncome: number): number {
  if (annualIncome <= 20000) return 0
  const maxAvdrag = TAX.jobbskatteavdragMaxAr
  const fullAvdragAt = TAX.jobbskatteavdragFullAt
  if (annualIncome >= fullAvdragAt) return maxAvdrag
  return maxAvdrag * (annualIncome / fullAvdragAt)
}

export interface LonInput {
  annualBrutto: number
  kommunalSkatt: number // procent, t.ex. 32.4
  over66: boolean
}

export interface LonResult {
  nettoAr: number
  nettoManad: number
  totalSkatt: number
  kommunalSkatt: number
  statligSkatt: number
  grundavdrag: number
  jobbskatteavdrag: number
}

export function calculateLon(input: LonInput): LonResult {
  const { annualBrutto, kommunalSkatt, over66 } = input

  const ga = grundavdrag(annualBrutto)
  const skattbarInkomst = Math.max(0, annualBrutto - ga)

  const kommunal = skattbarInkomst * (kommunalSkatt / 100)

  const brytpunkt = over66 ? TAX.brytpunktStatligOver66 : TAX.brytpunktStatligUnder66
  const statlig = Math.max(0, (annualBrutto - brytpunkt) * STATLIG_SKATTESATS)

  const jobbAvdrag = jobbskatteavdrag(annualBrutto)

  const totalSkatt = Math.max(0, kommunal + statlig - jobbAvdrag)
  const nettoAr = annualBrutto - totalSkatt

  return {
    nettoAr,
    nettoManad: nettoAr / 12,
    totalSkatt,
    kommunalSkatt: kommunal,
    statligSkatt: statlig,
    grundavdrag: ga,
    jobbskatteavdrag: jobbAvdrag,
  }
}

/** Hitta bruttolön från nettolön – iterativ sökning (binärsökning) */
export function bruttoFromNetto(
  targetNettoAr: number,
  kommunalSkatt: number,
  over66: boolean,
  tolerance = 1
): number {
  if (targetNettoAr <= 0) return 0
  let low = targetNettoAr
  let high = targetNettoAr * 2
  let iterations = 0
  const maxIter = 100
  while (iterations < maxIter) {
    const mid = (low + high) / 2
    const res = calculateLon({ annualBrutto: mid, kommunalSkatt, over66 })
    const diff = res.nettoAr - targetNettoAr
    if (Math.abs(diff) <= tolerance) return Math.round(mid)
    if (diff > 0) high = mid
    else low = mid
    iterations++
  }
  return Math.round((low + high) / 2)
}
