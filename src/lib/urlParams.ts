/**
 * Generiska hjälpfunktioner för URL-parametrar.
 * Använd i kalkylatorsidor för att minska duplicerad parse/build-logik.
 */

export function getNum(params: URLSearchParams, key: string, opts?: { min?: number; max?: number }): number | undefined {
  const s = params.get(key)
  if (s == null) return undefined
  const v = parseInt(s, 10)
  if (isNaN(v)) return undefined
  if (opts?.min != null && v < opts.min) return undefined
  if (opts?.max != null && v > opts.max) return undefined
  return v
}

export function getFloat(params: URLSearchParams, key: string, opts?: { min?: number; max?: number }): number | undefined {
  const s = params.get(key)
  if (s == null) return undefined
  const v = parseFloat(s)
  if (isNaN(v)) return undefined
  if (opts?.min != null && v < opts.min) return undefined
  if (opts?.max != null && v > opts.max) return undefined
  return v
}

export function getOneOf<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[]): T | undefined {
  const s = params.get(key)
  if (s == null) return undefined
  return allowed.includes(s as T) ? (s as T) : undefined
}

/** Bygger query-sträng från key-value. Filtrerar bort undefined. */
export function buildQueryString(record: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(record)) {
    if (v !== undefined && v !== '') params.set(k, String(v))
  }
  return params.toString()
}

/** Uppdaterar URL utan reload. path inkluderar pathname, params = query-objekt. */
export function replaceUrl(path: string, params: Record<string, string | number | boolean>): void {
  const q = buildQueryString(params)
  const url = q ? `${path}?${q}` : path
  window.history.replaceState({}, '', `${window.location.origin}${url}`)
}

// ─── Ränta på ränta (befintlig) ───────────────────────────────────────────

export interface CalculatorParams {
  initial: number
  monthly: number
  rate: number
  years: number
  tax?: 'ingen' | 'isk2025' | 'isk2026'
  inc?: number
  chart?: 'enkel' | 'detaljerad' | 'arsandel' | 'ackumulerad' | 'slumpad'
}

export function getParamsFromUrl(): Partial<CalculatorParams> {
  const params = new URLSearchParams(window.location.search)
  const result: Partial<CalculatorParams> = {}

  const i = params.get('i')
  if (i != null) {
    const v = parseInt(i, 10)
    if (!isNaN(v) && v >= 0) result.initial = Math.min(v, 10_000_000)
  }

  const m = params.get('m')
  if (m != null) {
    const v = parseInt(m, 10)
    if (!isNaN(v) && v >= 0) result.monthly = Math.min(v, 100_000)
  }

  const r = params.get('r')
  if (r != null) {
    const v = parseFloat(r)
    if (!isNaN(v) && v >= 0 && v <= 20) result.rate = v
  }

  const y = params.get('y')
  if (y != null) {
    const v = parseInt(y, 10)
    if (!isNaN(v) && v >= 1 && v <= 50) result.years = v
  }

  const tax = params.get('tax')
  if (tax === 'ingen' || tax === 'isk2025' || tax === 'isk2026') result.tax = tax

  const inc = params.get('inc')
  if (inc != null) {
    const v = parseFloat(inc)
    if (!isNaN(v) && v >= 0 && v <= 20) result.inc = v
  }

  const chart = params.get('chart')
  if (chart === 'enkel' || chart === 'detaljerad' || chart === 'arsandel' || chart === 'ackumulerad' || chart === 'slumpad') result.chart = chart

  return result
}

export function buildShareUrl(params: CalculatorParams): string {
  const search = new URLSearchParams({
    i: String(params.initial),
    m: String(params.monthly),
    r: String(params.rate),
    y: String(params.years),
  })
  if (params.tax && params.tax !== 'ingen') search.set('tax', params.tax)
  if (params.inc != null && params.inc > 0) search.set('inc', String(params.inc))
  if (params.chart && params.chart !== 'detaljerad') search.set('chart', params.chart)
  const path = '/rantapa-ranta'
  return `${window.location.origin}${path}?${search.toString()}`
}

export function updateUrlParams(params: CalculatorParams): void {
  const url = buildShareUrl(params)
  window.history.replaceState({}, '', url)
}
