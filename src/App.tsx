import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { GlobalNav } from './components/GlobalNav'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Catalog } from './pages/Catalog'

const OmSidan = lazy(() => import('./pages/OmSidan').then((m) => ({ default: m.OmSidan })))
const Samarbeten = lazy(() => import('./pages/Samarbeten').then((m) => ({ default: m.Samarbeten })))
const RantapaRanta = lazy(() => import('./pages/RantapaRanta').then((m) => ({ default: m.RantapaRanta })))
const Pensionkalkylator = lazy(() => import('./pages/Pensionkalkylator').then((m) => ({ default: m.Pensionkalkylator })))
const Bolanekalkylator = lazy(() => import('./pages/Bolanekalkylator').then((m) => ({ default: m.Bolanekalkylator })))
const Inflationskalkylator = lazy(() => import('./pages/Inflationskalkylator').then((m) => ({ default: m.Inflationskalkylator })))
const Lonekalkylator = lazy(() => import('./pages/Lonekalkylator').then((m) => ({ default: m.Lonekalkylator })))
const CSNkalkylator = lazy(() => import('./pages/CSNkalkylator').then((m) => ({ default: m.CSNkalkylator })))
const Procentraknare = lazy(() => import('./pages/Procentraknare').then((m) => ({ default: m.Procentraknare })))
const Momsraknare = lazy(() => import('./pages/Momsraknare').then((m) => ({ default: m.Momsraknare })))
const Semesterersattning = lazy(() => import('./pages/Semesterersattning').then((m) => ({ default: m.Semesterersattning })))
const Egenkostnad = lazy(() => import('./pages/Egenkostnad').then((m) => ({ default: m.Egenkostnad })))
const FIREkalkylator = lazy(() => import('./pages/FIREkalkylator').then((m) => ({ default: m.FIREkalkylator })))
const KALPkalkylator = lazy(() => import('./pages/KALPkalkylator').then((m) => ({ default: m.KALPkalkylator })))
const Timlon = lazy(() => import('./pages/Timlon').then((m) => ({ default: m.Timlon })))
const ISKskatt = lazy(() => import('./pages/ISKskatt').then((m) => ({ default: m.ISKskatt })))
const Skatteaterbaring = lazy(() => import('./pages/Skatteaterbaring').then((m) => ({ default: m.Skatteaterbaring })))
const Kontantinsats = lazy(() => import('./pages/Kontantinsats').then((m) => ({ default: m.Kontantinsats })))
const Loneutveckling = lazy(() => import('./pages/Loneutveckling').then((m) => ({ default: m.Loneutveckling })))
const Rantabilitet = lazy(() => import('./pages/Rantabilitet').then((m) => ({ default: m.Rantabilitet })))
const Aterbetalningstid = lazy(() => import('./pages/Aterbetalningstid').then((m) => ({ default: m.Aterbetalningstid })))
const BruttoFranNetto = lazy(() => import('./pages/BruttoFranNetto').then((m) => ({ default: m.BruttoFranNetto })))
const EffektivRanta = lazy(() => import('./pages/EffektivRanta').then((m) => ({ default: m.EffektivRanta })))
const Cagr = lazy(() => import('./pages/Cagr').then((m) => ({ default: m.Cagr })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center" aria-busy="true">
      <span className="text-stone-500">Laddar...</span>
    </div>
  )
}

function Layout() {
  return (
    <>
      <GlobalNav />
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<Catalog />} />
        <Route path="/om" element={<OmSidan />} />
        <Route path="/samarbeten" element={<Samarbeten />} />
        <Route path="/rantapa-ranta" element={<RantapaRanta />} />
        <Route path="/pensionskalkylator" element={<Pensionkalkylator />} />
        <Route path="/bolanekalkylator" element={<Bolanekalkylator />} />
        <Route path="/inflationskalkylator" element={<Inflationskalkylator />} />
        <Route path="/lonekalkylator" element={<Lonekalkylator />} />
        <Route path="/csn-kalkylator" element={<CSNkalkylator />} />
        <Route path="/procentraknare" element={<Procentraknare />} />
        <Route path="/momsraknare" element={<Momsraknare />} />
        <Route path="/semesterersattning" element={<Semesterersattning />} />
        <Route path="/egenkostnad" element={<Egenkostnad />} />
        <Route path="/fire-kalkylator" element={<FIREkalkylator />} />
        <Route path="/kalp-kalkylator" element={<KALPkalkylator />} />
        <Route path="/timlon" element={<Timlon />} />
        <Route path="/isk-skatt" element={<ISKskatt />} />
        <Route path="/skatteaterbaring" element={<Skatteaterbaring />} />
        <Route path="/kontantinsats" element={<Kontantinsats />} />
        <Route path="/loneutveckling" element={<Loneutveckling />} />
        <Route path="/rantabilitet" element={<Rantabilitet />} />
        <Route path="/aterbetalningstid" element={<Aterbetalningstid />} />
        <Route path="/brutto-fran-netto" element={<BruttoFranNetto />} />
        <Route path="/effektiv-ranta" element={<EffektivRanta />} />
        <Route path="/cagr" element={<Cagr />} />
        <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
