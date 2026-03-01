import { Link } from 'react-router-dom'
import { Accordion } from './Accordion'
import { calculatorInfo, type CalculatorId } from '../data/calculatorInfo'
import { LINKS, resolveUrl } from '../config/links'
import { LAST_UPDATED } from '../config/yearly'

const ACCENT_CLASSES: Record<CalculatorId, string> = {
  'rantapa-ranta': 'text-stone-600 hover:text-[#1a4d2e]',
  bolan: 'text-stone-600 hover:text-[#1a4d2e]',
  inflation: 'text-stone-600 hover:text-[#1a4d2e]',
  lon: 'text-stone-600 hover:text-[#1a4d2e]',
  csn: 'text-stone-600 hover:text-[#1a4d2e]',
  pension: 'text-stone-600 hover:text-[#1a4d2e]',
  procent: 'text-stone-600 hover:text-[#1a4d2e]',
  moms: 'text-stone-600 hover:text-[#1a4d2e]',
  semester: 'text-stone-600 hover:text-[#1a4d2e]',
  egenkostnad: 'text-stone-600 hover:text-[#1a4d2e]',
  fire: 'text-stone-600 hover:text-[#1a4d2e]',
  kalp: 'text-stone-600 hover:text-[#1a4d2e]',
  timlon: 'text-stone-600 hover:text-[#1a4d2e]',
  isk: 'text-stone-600 hover:text-[#1a4d2e]',
  skatteaterbaring: 'text-stone-600 hover:text-[#1a4d2e]',
  kontantinsats: 'text-stone-600 hover:text-[#1a4d2e]',
  loneutveckling: 'text-stone-600 hover:text-[#1a4d2e]',
  rantabilitet: 'text-stone-600 hover:text-[#1a4d2e]',
  aterbetalningstid: 'text-stone-600 hover:text-[#1a4d2e]',
  bruttoFranNetto: 'text-stone-600 hover:text-[#1a4d2e]',
  effektivRanta: 'text-stone-600 hover:text-[#1a4d2e]',
  cagr: 'text-stone-600 hover:text-[#1a4d2e]',
}

interface CalculatorInfoSectionProps {
  calculatorId: CalculatorId
}

/** Renders text with [1], [2] as footnote links to #kallor-1, #kallor-2 */
function parseFootnotes(text: string, accent: string): React.ReactNode[] {
  const parts = text.split(/(\[\d+\])/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (match) {
      const num = match[1]
      return (
        <sup key={i}>
          <a href={`#kallor-${num}`} className={`${accent} font-medium`} aria-label={`Källa ${num}`}>
            [{num}]
          </a>
        </sup>
      )
    }
    return part
  })
}

export function CalculatorInfoSection({ calculatorId }: CalculatorInfoSectionProps) {
  const info = calculatorInfo[calculatorId]
  const accent = ACCENT_CLASSES[calculatorId]

  const scrollToCalculator = () => {
    document.getElementById('kalkylator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="faq-och-kallor" className="mt-12 pt-8 border-t border-stone-200 scroll-mt-24 no-print">
      <p className="text-sm text-stone-500 mb-6">
        <button
          type="button"
          onClick={scrollToCalculator}
          className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#1a4d2e] transition-colors focus:outline-none focus:underline"
          aria-label="Scrolla upp till kalkylatorn"
        >
          <ChevronUpIcon aria-hidden />
          Upp till kalkylatorn
        </button>
      </p>

      <h2 className="text-xl font-semibold text-stone-800 mb-8">Mer att läsa</h2>

      <div className="space-y-6">
        {/* Vanliga frågor – platt lista, ingen nästlad accordion */}
        {info.faqs.length > 0 && (
          <div className="p-5 rounded-lg bg-stone-50 border border-stone-100">
            <h3 className="text-base font-semibold text-stone-800 mb-4">Vanliga frågor</h3>
            <div className="space-y-1">
              {info.faqs.map((faq, i) => (
                <Accordion
                  key={i}
                  variant="faq"
                  className="group/faq"
                  summary={
                    <>
                      <span className="text-sm font-medium pr-2">{faq.question}</span>
                      <span className="text-stone-400 group-data-[open=true]:rotate-180 transition-transform shrink-0 mt-0.5"><ChevronIcon /></span>
                    </>
                  }
                >
                  <p className="pb-4 text-sm text-stone-600 leading-relaxed">
                    {parseFootnotes(faq.answer, accent)}
                  </p>
                </Accordion>
              ))}
            </div>
          </div>
        )}

        {info.facts && info.facts.length > 0 && (
          <div className="p-5 rounded-lg bg-stone-50 border border-stone-100">
            <h3 className="text-base font-semibold text-stone-800 mb-4">Fakta</h3>
            <div className="space-y-4">
              {info.facts.map((block, i) => (
                <div key={i}>
                  <h4 className="text-sm font-medium text-stone-800 mb-1">{block.title}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {parseFootnotes(block.content, accent)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {info.glossary && info.glossary.length > 0 && (
          <div className="p-5 rounded-lg bg-stone-50 border border-stone-100">
            <h3 className="text-base font-semibold text-stone-800 mb-4">Ordlista</h3>
            <dl className="space-y-3">
              {info.glossary.map((item, i) => (
                <div key={i}>
                  <dt className="text-sm font-medium text-stone-800">{item.term}</dt>
                  <dd className="text-sm text-stone-600 mt-0.5">{item.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div id="kallor" className="scroll-mt-24 p-5 rounded-lg bg-stone-50 border border-stone-100">
          <h3 className="text-base font-semibold text-stone-800 mb-4">Källor</h3>
          <p className="text-sm text-stone-600 mb-3">
            Siffror och rekommendationer bygger på följande källor. Uppdaterad {LAST_UPDATED}.
          </p>
          <ol className="space-y-2 list-none">
            {info.sources.map((source, i) => (
              <li key={i} id={`kallor-${i + 1}`} className="flex gap-2 scroll-mt-24">
                <span className="text-stone-400 shrink-0">[{i + 1}]</span>
                <span>
                  <a
                    href={LINKS[source.linkId]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm hover:underline ${accent}`}
                  >
                    {source.name}
                  </a>
                  <span className="text-stone-500 text-sm"> – {source.description}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {info.readMore.length > 0 && (
          <div className="p-5 rounded-lg bg-stone-50 border border-stone-100">
            <h3 className="text-base font-semibold text-stone-800 mb-4">Läs mer</h3>
            <ul className="space-y-2">
              {info.readMore.map((item, i) => {
                const url = item.linkId
                  ? resolveUrl({ type: 'link', id: item.linkId })
                  : resolveUrl({ type: 'route', id: item.routeId! })
                const isInternal = Boolean(item.routeId)
                return (
                  <li key={i}>
                    {isInternal ? (
                      <Link to={url} className={`text-sm hover:underline ${accent}`}>
                        {item.label} →
                      </Link>
                    ) : (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm hover:underline ${accent}`}
                      >
                        {item.label} →
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}
