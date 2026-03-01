import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import type { RouteId } from '../config/links'
import { getPageMeta } from '../config/pageMeta'

interface PageMetaProps {
  /** Route-id för att hämta titel/beskrivning från config */
  routeId: RouteId
  /** Överskriv titel (valfritt) */
  title?: string
  /** Överskriv description (valfritt) */
  description?: string
}

/**
 * Sätter sid-specifika title, meta description och OG/Twitter-taggar.
 * Wrappar react-helmet-async. Använd i varje sida för SEO.
 */
export function PageMeta({ routeId, title, description }: PageMetaProps) {
  const { pathname } = useLocation()
  const meta = getPageMeta(routeId)
  const finalTitle = title ?? meta.title
  const finalDesc = description ?? meta.description
  const siteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://example.com')
  const canonicalUrl = `${siteUrl}${pathname}`

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
    </Helmet>
  )
}
