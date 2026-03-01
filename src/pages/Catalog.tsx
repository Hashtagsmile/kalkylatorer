import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Footer } from '../components/Footer'
import { PageMeta } from '../components/PageMeta'
import { ROUTES } from '../config/links'
import { SITE } from '../config/site'
import { CATALOG_GROUPS } from '../config/catalog'
import { isCalculatorEnabled, isCalculatorBeta } from '../config/calculators'
import {
  PercentIcon,
  PensionIcon,
  HouseIcon,
  ChartIcon,
  BriefcaseIcon,
  GraduationIcon,
  SunIcon,
  FlameIcon,
  WalletIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ScaleIcon,
  CoinsIcon,
  CalendarIcon,
  PiggyBankIcon,
  ArrowLeftRightIcon,
  ClockIcon,
  ReceiptIcon,
  BanknoteIcon,
  LayersIcon,
  BuildingIcon,
  BarChartIcon,
} from '../components/CalculatorIcons'

const SLUG_TO_ICON: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  'rantapa-ranta': LayersIcon,
  cagr: TrendingUpIcon,
  'fire-kalkylator': FlameIcon,
  'isk-skatt': CoinsIcon,
  pensionskalkylator: PensionIcon,
  bolanekalkylator: HouseIcon,
  rantabilitet: ScaleIcon,
  'effektiv-ranta': ChartIcon,
  aterbetalningstid: CalendarIcon,
  kontantinsats: PiggyBankIcon,
  'kalp-kalkylator': WalletIcon,
  'csn-kalkylator': GraduationIcon,
  lonekalkylator: BriefcaseIcon,
  'brutto-fran-netto': ArrowLeftRightIcon,
  loneutveckling: BarChartIcon,
  egenkostnad: BuildingIcon,
  timlon: ClockIcon,
  semesterersattning: SunIcon,
  inflationskalkylator: TrendingDownIcon,
  procentraknare: PercentIcon,
  momsraknare: ReceiptIcon,
  skatteaterbaring: BanknoteIcon,
}

interface Tool {
  slug: string
  title: string
  description: string
  Icon: React.ComponentType<{ className?: string; size?: number }>
  href: string
}

export function Catalog() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const i = searchParams.get('i')
    const m = searchParams.get('m')
    const r = searchParams.get('r')
    const y = searchParams.get('y')
    const b = searchParams.get('b')
    const s = searchParams.get('s')
    const loan = searchParams.get('loan')
    const amt = searchParams.get('amt')
    const sal = searchParams.get('sal')
    const skuld = searchParams.get('skuld')
    if (i != null || m != null || r != null || y != null) {
      navigate(`${ROUTES.rantapaRanta}?${searchParams.toString()}`, { replace: true })
    } else if (b != null || s != null) {
      navigate(`${ROUTES.pensionskalkylator}?${searchParams.toString()}`, { replace: true })
    } else if (loan != null) {
      navigate(`${ROUTES.bolanekalkylator}?${searchParams.toString()}`, { replace: true })
    } else if (amt != null || searchParams.get('inf') != null) {
      navigate(`${ROUTES.inflationskalkylator}?${searchParams.toString()}`, { replace: true })
    } else if (sal != null) {
      navigate(`${ROUTES.lonekalkylator}?${searchParams.toString()}`, { replace: true })
    } else if (skuld != null) {
      navigate(`${ROUTES.csnKalkylator}?${searchParams.toString()}`, { replace: true })
    }
  }, [navigate, searchParams])

  let cardIndex = 0
  const totalEnabledCount = CATALOG_GROUPS.reduce(
    (sum, group) => sum + group.tools.filter((t) => isCalculatorEnabled(t.href)).length,
    0
  )
  const toolGroupsWithIcons: { title: string; tools: Tool[] }[] = CATALOG_GROUPS.map((group) => ({
    title: group.title,
    tools: group.tools.map((t) => ({
      ...t,
      Icon: SLUG_TO_ICON[t.slug] ?? ChartIcon,
    })),
  }))

  const fadeInVariants = {
    hidden: { opacity: 0, ...(reducedMotion ? {} : { y: -6 }) },
    visible: { opacity: 1, ...(reducedMotion ? {} : { y: 0 }) },
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageMeta routeId="home" />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-12" tabIndex={-1}>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          transition={{ duration: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2 font-display"
        >
          Välj kalkylator
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          transition={{ duration: 0.3, delay: 0.075 }}
          className="text-stone-600 mb-8 text-base sm:text-lg max-w-2xl"
        >
          {SITE.getCatalogIntro(totalEnabledCount)}
        </motion.p>

        <div className="space-y-10">
          {toolGroupsWithIcons.map((group) => {
            const enabledTools = group.tools.filter((t) => isCalculatorEnabled(t.href))
            if (enabledTools.length === 0) return null
            return (
              <section key={group.title} className="space-y-4">
                <h2 className="text-lg font-semibold text-stone-800 border-b border-stone-200 pb-2">
                  {group.title}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {enabledTools.map((tool) => {
                    const delay = (cardIndex++ * 45) / 1000
                    return (
                    <Link
                      key={tool.slug}
                      to={tool.href}
                      className="block focus:outline-none focus:ring-1 focus:ring-stone-400 focus:ring-offset-1 rounded-lg"
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0, ...(reducedMotion ? {} : { y: 12 }) },
                          visible: { opacity: 1, ...(reducedMotion ? {} : { y: 0 }) },
                        }}
                        transition={{ duration: 0.5, delay }}
                        className="p-6 bg-white rounded-lg border border-stone-200 hover:border-stone-300 hover:shadow-md hover:shadow-stone-900/5 transition-[box-shadow,border-color] duration-200 ease-out group relative h-full"
                      >
                        {isCalculatorBeta(tool.href) && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium bg-stone-100 text-stone-700 rounded-sm">
                            Ny
                          </span>
                        )}
                        <div className="w-14 h-14 rounded-lg bg-stone-100 flex items-center justify-center text-2xl mb-4 [&>svg]:w-7 [&>svg]:h-7 [&>svg]:text-stone-600 group-hover:scale-105 transition-transform duration-200">
                          <tool.Icon size={28} className="text-stone-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-stone-900 mb-2">{tool.title}</h3>
                        <p className="text-sm text-stone-600">{tool.description}</p>
                        <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-stone-600 group-hover:text-stone-900">
                          Öppna kalkylatorn
                          <span aria-hidden>→</span>
                        </span>
                      </motion.div>
                    </Link>
                  )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <p className="mt-10 text-sm text-stone-500">
          Alla beräkningar sker lokalt i din webbläsare. Vi sparar inga uppgifter. Vi finansierar tjänsten genom annonser –{' '}
          <Link to={ROUTES.om} className="text-stone-600 hover:text-stone-900 hover:underline">
            läs mer om hur vi håller sidan gratis
          </Link>
          .
        </p>
      </main>

      <Footer showCatalogLink={false} />
    </div>
  )
}

