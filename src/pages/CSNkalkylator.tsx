import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { calculateCSN, getCSNYearlySchedule, CSN_RANTA_2025, CSN_RANTA_2026 } from '../lib/csnCalculations'
import { ShareModal } from '../components/ShareModal'
import { AdSlot } from '../components/AdSlot'
import { Accordion } from '../components/Accordion'
import { CalculatorInfoSection } from '../components/CalculatorInfoSection'
import { ResultActions } from '../components/ResultActions'
import { Disclaimer } from '../components/Disclaimer'
import { CalculatorPageHeader } from '../components/CalculatorPageHeader'
import { GraduationIcon } from '../components/CalculatorIcons'
import { Chip } from '../components/Chip'
import { InputWithUnit } from '../components/InputWithUnit'
import { TimeSeriesChart } from '../components/TimeSeriesChart'
import { YearValueTable } from '../components/YearValueTable'
import { PageMeta } from '../components/PageMeta'
import { Footer } from '../components/Footer'

const DEFAULT_SKULD = 230000
const DEFAULT_AR = 15

const SKULD_PRESETS = [100000, 230000, 350000, 500000, 612000] as const
const AR_PRESETS = [10, 15, 20, 25] as const

const RANTA_PRESETS = [
  { label: '2025 (1,98 %)', value: CSN_RANTA_2025 },
  { label: '2026 (2,14 %)', value: CSN_RANTA_2026 },
] as const

const SCENARIOS = [
  { id: 'studerande', title: 'Studerande (fullt lån)', skuld: 612000, ar: 25, desc: 'Fullt studielån 5 år' },
  { id: 'aterbetalning', title: 'Återbetalning', skuld: 230000, ar: 15, desc: 'Typisk skuld, 15 år kvar' },
  { id: 'delvis', title: 'Delvis lån', skuld: 350000, ar: 20, desc: '3–4 år studier' },
  { id: 'liten', title: 'Liten skuld', skuld: 100000, ar: 10, desc: 'Kortare studier' },
] as const

function buildShareUrl(params: { skuld: number; ar: number; ranta?: number }): string {
  const search = new URLSearchParams({
    skuld: String(params.skuld),
    ar: String(params.ar),
  })
  if (params.ranta != null && params.ranta !== CSN_RANTA_2025) {
    search.set('ranta', String((params.ranta * 100).toFixed(2)))
  }
  return `${window.location.origin}${window.location.pathname}?${search.toString()}`
}

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const result: Partial<{ skuld: number; ar: number; ranta: number }> = {}
  const skuld = params.get('skuld')
  if (skuld != null) {
    const v = parseInt(skuld, 10)
    if (!isNaN(v) && v >= 0) result.skuld = Math.min(v, 5000000)
  }
  const ar = params.get('ar')
  if (ar != null) {
    const v = parseInt(ar, 10)
    if (!isNaN(v) && v >= 1 && v <= 25) result.ar = v
  }
  const ranta = params.get('ranta')
  if (ranta != null) {
    const v = parseFloat(ranta)
    if (!isNaN(v) && v >= 0 && v <= 10) result.ranta = v / 100
  }
  return result
}

function getInitialState() {
  const url = getParamsFromUrl()
  return {
    skuld: url.skuld ?? DEFAULT_SKULD,
    ar: url.ar ?? DEFAULT_AR,
    ranta: url.ranta ?? CSN_RANTA_2025,
  }
}

export function CSNkalkylator() {
  const init = getInitialState()
  const [skuld, setSkuld] = useState(init.skuld)
  const [arKvar, setArKvar] = useState(init.ar)
  const [ranta, setRanta] = useState(init.ranta)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    window.history.replaceState({}, '', buildShareUrl({ skuld, ar: arKvar, ranta }))
  }, [skuld, arKvar, ranta])

  const result = calculateCSN({ skuld, arKvar, ranta })
  const yearlySchedule = getCSNYearlySchedule(skuld, arKvar, ranta)
  const yearlyBalance = yearlySchedule.map(({ year, balance }) => ({ year, value: balance }))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="csnKalkylator" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:py-8" tabIndex={-1}>
        <div className="mb-6 no-print">
          <AdSlot placement="top" />
        </div>

        <CalculatorPageHeader
          title="CSN-kalkylator"
          subtitle="Räkna ut månadskostnad och total kostnad för annuitetslån. Räntan är samma för alla lån från 1989. Källa: CSN."
          accentColor="indigo"
          icon={<GraduationIcon />}
        >
          <Accordion summary="Läs mer om återbetalning" className="mt-3">
            <p className="mt-2 text-sm text-slate-600">
              Max återbetalningstid 25 år. Måste vara klart år du fyller 64. Minimibelopp per år beror på skuld.
            </p>
          </Accordion>
        </CalculatorPageHeader>

        <div id="kalkylator" className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-6 mb-6 no-print scroll-mt-24">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Dina uppgifter</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Välj ett scenario</h3>
            <div className="flex flex-wrap gap-1.5">
              {SCENARIOS.map((s) => {
                const isActive = skuld === s.skuld && arKvar === s.ar
                return (
                  <Chip
                    key={s.id}
                    isActive={isActive}
                    onClick={() => {
                      if (isActive) {
                        setSkuld(DEFAULT_SKULD)
                        setArKvar(DEFAULT_AR)
                      } else {
                        setSkuld(s.skuld)
                        setArKvar(s.ar)
                      }
                    }}
                    title={isActive ? 'Klicka för att nollställa' : s.desc}
                    ariaLabel={isActive ? `Nollställ (${s.title})` : `Välj scenario: ${s.title}. ${s.desc}`}
                    accentColor="indigo"
                    variant="scenario"
                  >
                    {s.title}
                  </Chip>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="skuld" className="block text-sm font-medium text-stone-700 mb-1">
                Skuld (kr)
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Din totala CSN-skuld – finns på Min CSN eller ditt lånebesked. Fullt studielån 5 år ≈ 612 000 kr.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SKULD_PRESETS.map((p) => (
                  <Chip
                    key={p}
                    isActive={skuld === p}
                    onClick={() => setSkuld(p)}
                    accentColor="indigo"
                  >
                    {(p / 1000).toFixed(0)} k kr
                  </Chip>
                ))}
              </div>
              <InputWithUnit
                id="skuld"
                type="number"
                min={0}
                max={5000000}
                value={skuld || ''}
                onChange={(e) => setSkuld(Math.min(5000000, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                unit="kr"
                formatThousands
                maxWidth="md"
                focusRingColor="indigo"
              />
            </div>

            <div>
              <label htmlFor="ar" className="block text-sm font-medium text-stone-700 mb-1">
                År kvar att betala
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Max 25 år. Lånet måste vara återbetalt år du fyller 64. Minimibelopp per år beror på skulden.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {AR_PRESETS.map((p) => (
                  <Chip key={p} isActive={arKvar === p} onClick={() => setArKvar(p)} accentColor="indigo">
                    {p} år
                  </Chip>
                ))}
              </div>
              <InputWithUnit
                id="ar"
                type="number"
                min={1}
                max={25}
                value={arKvar}
                onChange={(e) => setArKvar(Math.min(25, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                unit="år"
                maxWidth="sm"
                focusRingColor="indigo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Ränta
              </label>
              <p className="text-xs text-stone-500 mb-2">
                Samma ränta för alla studielån från 1989 – oberoende av lånebelopp. Välj år eller ange manuellt. Källa: CSN.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {RANTA_PRESETS.map((p) => (
                  <Chip
                    key={p.label}
                    isActive={Math.abs(ranta - p.value) < 0.0001}
                    onClick={() => setRanta(p.value)}
                    accentColor="indigo"
                  >
                    {p.label}
                  </Chip>
                ))}
              </div>
              <InputWithUnit
                id="ranta"
                type="number"
                min={0}
                max={10}
                step={0.01}
                value={(ranta * 100).toFixed(2)}
                onChange={(e) => setRanta(Math.min(0.1, Math.max(0, parseFloat(e.target.value) || 0) / 100))}
                unit="%"
                maxWidth="sm"
                focusRingColor="indigo"
              />
            </div>
          </div>
        </div>

        <section className="p-5 sm:p-6 bg-white rounded-lg border border-stone-200 shadow-sm print:shadow-none print:border print:rounded-lg" aria-live="polite" aria-label="Beräkningsresultat">
          <div className="hidden print:block mb-4 pb-3 border-b border-stone-300">
            <h1 className="text-xl font-bold text-stone-900">CSN-kalkylator – Resultat</h1>
            <p className="text-sm text-slate-600 mt-1">
              Utskrift: {new Date().toLocaleDateString('sv-SE', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Skuld: {skuld.toLocaleString('sv-SE')} kr · År kvar: {arKvar} · Ränta: {(ranta * 100).toFixed(2)} %
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Resultat</h2>
            <ResultActions onShareClick={() => setShareModalOpen(true)} />
          </div>

          {/* Hero metrics */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4">
            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Månadskostnad</p>
              <p className="text-2xl sm:text-3xl font-bold text-indigo-800 tabular-nums">
                {Math.round(result.manadskostnad).toLocaleString('sv-SE')} kr
              </p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Årsbelopp</p>
              <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                {Math.round(result.arsbelopp).toLocaleString('sv-SE')} kr
              </p>
            </div>
            <div className="p-5 sm:p-6 rounded-lg bg-stone-50 border border-stone-100 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">Total räntekostnad</p>
              <p className="text-xl sm:text-2xl font-bold text-stone-800 tabular-nums">
                {Math.round(result.totalRanta).toLocaleString('sv-SE')} kr
              </p>
            </div>
          </div>
          <div className="mt-6 no-print">
            <TimeSeriesChart
              data={yearlyBalance}
              title="Kvarvarande skuld över tid"
              valueLabel="Skuld"
              accentColor="indigo"
            />
          </div>

          <Accordion
            id="year-table-details"
            summary="Visa tabell år för år"
            className="mt-6 p-4 bg-white rounded-lg border border-stone-200 print:border print:rounded-lg print:block"
          >
            <YearValueTable
              rows={yearlyBalance}
              valueHeader="Kvarvarande skuld"
              valueFormatter={(v) => `${Math.round(v).toLocaleString('sv-SE')} kr`}
            />
          </Accordion>

          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-sm no-print">
            <Link to="/lonekalkylator" className="text-stone-600 hover:text-stone-900 hover:underline">Lönekalkylator</Link>
            <Link to="/rantapa-ranta" className="text-stone-600 hover:text-stone-900 hover:underline">Ränta-på-ränta</Link>
          </div>
        </section>

        <div className="mt-6 no-print">
          <Disclaimer variant="general" />
        </div>

        <div className="mt-6 no-print">
          <AdSlot placement="middle" />
        </div>

        <CalculatorInfoSection calculatorId="csn" />

        <div className="mt-8">
          <Link to="/" className="text-stone-600 hover:text-stone-900 hover:underline text-sm">← Fler kalkylatorer</Link>
        </div>
      </main>

      <Footer accentColor="indigo" shortText />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={buildShareUrl({ skuld, ar: arKvar, ranta })}
        title="Dela CSN-beräkningen"
      />
    </div>
  )
}
