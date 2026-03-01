/**
 * Beräkna månatligt sparande för att nå ett mål
 * Formel: monthly = (target - initial*(1+r)^n) / [((1+r)^n - 1) / r]
 */
export function monthlyNeededForTarget(
  target: number,
  initial: number,
  rate: number,
  years: number
): number {
  const r = rate / 100 / 12
  const n = 12 * years
  const growth = Math.pow(1 + r, n)
  const futureInitial = initial * growth
  const remaining = target - futureInitial

  if (remaining <= 0) return 0
  if (r === 0) return remaining / n

  const annuityFactor = (growth - 1) / r
  return remaining / annuityFactor
}
