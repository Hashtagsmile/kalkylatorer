import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShareModal } from '../components/ShareModal'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { AdSlot } from '../components/AdSlot'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { WalletIcon } from '../components/CalculatorIcons'
import { InputWithUnit } from '../components/InputWithUnit'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'
import { ROUTES } from '../config/links'

const DEFAULT_INKOMST = 45000
const DEFAULT_BOENDE = 15000
const DEFAULT_VUXNA = 2
const DEFAULT_BARN = 0
const DEFAULT_BR = true

const KALP_SCENARIOS = [
  { id: 'typiskt', title: 'Typiskt hushåll', inkomst: 45000, boende: 15000, vuxna: 2, barn: 0, br: true, desc: '2 vuxna, bostadsrätt' },
  { id: 'enstaka', title: 'Enstaka förälder', inkomst: 35000, boende: 12000, vuxna: 1, barn: 2, br: false, desc: '1 vuxen, 2 barn, hyresrätt' },
  { id: 'sparsamt', title: 'Sparsamt', inkomst: 55000, boende: 18000, vuxna: 2, barn: 0, br: true, desc: 'Högre inkomst, högre boende' },
  { id: 'studerande', title: 'Studerande/nyexad', inkomst: 22000, boende: 8000, vuxna: 1, barn: 0, br: false, desc: 'Lägre inkomst, hyresrätt' },
] as const

/** Konsumentverkets/Finansinspektionens schablonbelopp (ca 2025) – kr/månad */
const LEVNADSKOSTNADER = {
  vuxen1: 9900,
  vuxen2: 17200,
  perBarn: 3700,
  driftskostnadBR: 3100,
} as const

function buildShareUrl(p: { inkomst: number; boende: number; vuxna: number; barn: number; br: boolean }) {
  const q = new URLSearchParams({ ink: String(p.inkomst), bo: String(p.boende), v: String(p.vuxna), b: String(p.barn), br: p.br ? '1' : '0' })
  return `${window.location.origin}${window.location.pathname}?${q}`
}

function getParamsFromUrl() {
  const q = new URLSearchParams(window.location.search)
  return {
    antalVuxna: q.get('v') != null ? Math.min(2, Math.max(1, parseInt(q.get('v')!, 10) || 2)) : 2,
    antalBarn: q.get('b') != null ? Math.min(10, Math.max(0, parseInt(q.get('b')!, 10) || 0)) : 0,
    manadsinkomst: q.get('ink') != null ? Math.max(0, parseInt(q.get('ink')!, 10) || 45000) : 45000,
    boendekostnad: q.get('bo') != null ? Math.max(0, parseInt(q.get('bo')!, 10) || 15000) : 15000,
    harBostadsratt: q.get('br') !== '0',
  }
}

export function KALPkalkylator() {
  const location = useLocation()
  const urlParams = getParamsFromUrl()
  const [antalVuxna, setAntalVuxna] = useState(urlParams.antalVuxna)
  const [antalBarn, setAntalBarn] = useState(urlParams.antalBarn)
  const [manadsinkomst, setManadsinkomst] = useState(urlParams.manadsinkomst)
  const [boendekostnad, setBoendekostnad] = useState(urlParams.boendekostnad)
  const [harBostadsratt, setHarBostadsratt] = useState(urlParams.harBostadsratt)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    const params = getParamsFromUrl()
    setAntalVuxna(params.antalVuxna)
    setAntalBarn(params.antalBarn)
    setManadsinkomst(params.manadsinkomst)
    setBoendekostnad(params.boendekostnad)
    setHarBostadsratt(params.harBostadsratt)
  }, [location.search])

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl({ inkomst: manadsinkomst, boende: boendekostnad, vuxna: antalVuxna, barn: antalBarn, br: harBostadsratt }))
  }, [manadsinkomst, boendekostnad, antalVuxna, antalBarn, harBostadsratt])

  const levnadskostnad =
    antalVuxna === 1
      ? LEVNADSKOSTNADER.vuxen1
      : LEVNADSKOSTNADER.vuxen2
  const barnkostnad = antalBarn * LEVNADSKOSTNADER.perBarn
  const driftskostnad = harBostadsratt ? LEVNADSKOSTNADER.driftskostnadBR : 0
  const totalLevnad = levnadskostnad + barnkostnad + driftskostnad
  const kalp = manadsinkomst - boendekostnad - totalLevnad

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="kalpKalkylator" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="KALP-kalkylator"
          subtitle="Kvar Att Leva På – räkna ut vad som blir kvar efter boende och levnadskostnader. Används vid bolånebeslut."
          accentColor="amber"
          icon={<WalletIcon />}
        >
          <Accordion summary="Läs mer om KALP" className="mt-3">
            <p className="mt-2 text-sm text-slate-600">
              Levnadskostnaderna baseras på Konsumentverkets schabloner. Banker vill ofta se minst 5 000–6 000 kr kvar (2 vuxna) för bolån.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {KALP_SCENARIOS.map((s) => {
                const isActive = manadsinkomst === s.inkomst && boendekostnad === s.boende && antalVuxna === s.vuxna && antalBarn === s.barn && harBostadsratt === s.br
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setManadsinkomst(DEFAULT_INKOMST)
                        setBoendekostnad(DEFAULT_BOENDE)
                        setAntalVuxna(DEFAULT_VUXNA)
                        setAntalBarn(DEFAULT_BARN)
                        setHarBostadsratt(DEFAULT_BR)
                      } else {
                        setManadsinkomst(s.inkomst)
                        setBoendekostnad(s.boende)
                        setAntalVuxna(s.vuxna)
                        setAntalBarn(s.barn)
                        setHarBostadsratt(s.br)
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-xs border transition-colors touch-manipulation text-left focus:outline-none focus:ring-1 focus:ring-amber-400 focus:ring-offset-1 ${
                      isActive ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-transparent text-stone-500 hover:bg-stone-50 hover:text-slate-600'
                    }`}
                    title={isActive ? 'Klicka för att nollställa' : s.desc}
                    aria-label={isActive ? `Nollställ (${s.title})` : `Välj scenario: ${s.title}. ${s.desc}`}
                  >
                    {s.title}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="inkomst" className="block text-sm font-medium text-stone-700 mb-1">
                Månadsinkomst (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Hushållets totala inkomst efter skatt.
              </p>
              <InputWithUnit
                id="inkomst"
                type="number"
                min={0}
                value={manadsinkomst || ''}
                onChange={(e) => setManadsinkomst(Math.max(0, parseInt(e.target.value, 10) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="amber"
              />
            </div>

            <div>
              <label htmlFor="boende" className="block text-sm font-medium text-stone-700 mb-1">
                Boendekostnad (kr/månad)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Hyra, ränta, amortering, avgift, el, värme m.m.
              </p>
              <InputWithUnit
                id="boende"
                type="number"
                min={0}
                value={boendekostnad || ''}
                onChange={(e) => setBoendekostnad(Math.max(0, parseInt(e.target.value, 10) || 0))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="amber"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Hushåll</label>
              <div className="flex flex-wrap gap-4">
                <div>
                  <span className="text-xs text-stone-500 block mb-1">Antal vuxna</span>
                  <div className="flex gap-2">
                    {[1, 2].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setAntalVuxna(n)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          antalVuxna === n ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-slate-200'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-stone-500 block mb-1">Antal barn</span>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setAntalBarn(n)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          antalBarn === n ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-slate-200'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Bostadstyp</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setHarBostadsratt(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    harBostadsratt ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-slate-200'
                  }`}
                >
                  Bostadsrätt (+ driftskostnad)
                </button>
                <button
                  type="button"
                  onClick={() => setHarBostadsratt(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    !harBostadsratt ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-slate-200'
                  }`}
                >
                  Hyresrätt / Villa
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Bostadsrätt: +{LEVNADSKOSTNADER.driftskostnadBR.toLocaleString('sv-SE')} kr/månad driftskostnad (Konsumentverket).
              </p>
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">KALP-kalkylator – Resultat</h1>
            <p className="text-sm text-stone-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>
          {/* Hero metric */}
          <div className="mt-6 p-4 rounded-lg border border-stone-200 bg-stone-50">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">KALP – Kvar att leva på</p>
            <p className={`text-2xl sm:text-3xl font-bold tabular-nums ${kalp >= 0 ? 'text-amber-800' : 'text-red-600'}`}>
              {Math.round(kalp).toLocaleString('sv-SE')} kr/månad
            </p>
            {kalp < 5000 && kalp >= 0 && (
              <p className="text-sm text-amber-700 mt-2">
                Banker vill ofta se minst 5 000–6 000 kr (2 vuxna) eller 3 000–4 000 kr (1 vuxen) kvar för bolån.
              </p>
            )}
            {kalp < 0 && (
              <p className="text-sm text-red-600 mt-2">
                Utgifterna överstiger inkomsten. Överväg att minska boendekostnaden eller öka inkomsten.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-3">Uppdelning</p>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Inkomst', value: manadsinkomst, color: '#10b981' },
                { label: '− Boendekostnad', value: -boendekostnad, color: '#0d9488', prefix: '−' },
                { label: '− Levnadskostnader (schablon)', value: -totalLevnad, color: '#64748b', prefix: '−' },
              ].map(({ label, value, color, prefix }) => (
                <li key={label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden />
                    {label}
                  </span>
                  <span className="tabular-nums font-medium text-stone-800">
                    {prefix ?? ''}{Math.round(Math.abs(value)).toLocaleString('sv-SE')} kr
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 pt-2 border-t border-stone-200 font-medium">
                <span className="text-stone-800">= KALP</span>
                <span className="tabular-nums text-amber-700">{Math.round(kalp).toLocaleString('sv-SE')} kr</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to={ROUTES.bolanekalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Bolånekalkylator</Link>
            <Link to={ROUTES.lonekalkylator} className="text-stone-600 hover:text-stone-900 hover:underline">Lönekalkylator</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="kalp" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="amber" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ inkomst: manadsinkomst, boende: boendekostnad, vuxna: antalVuxna, barn: antalBarn, br: harBostadsratt })}
        title="Dela KALP-beräkningen"
      />
    </div>
  )
}
