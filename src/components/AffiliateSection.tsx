import { affiliate } from '../config'

const ITEMS = [
  {
    id: 'isk',
    title: 'Öppna ISK',
    description: 'Spara skatteeffektivt i indexfonder. ISK har låg skatt och ingen deklaration av varje affär.',
    url: affiliate.isk,
  },
  {
    id: 'sparkonto',
    title: 'Jämför sparkonton',
    description: 'Hitta bästa sparräntan för dina pengar. Skillnaden kan vara tusentals kronor per år.',
    url: affiliate.sparkonto,
  },
  {
    id: 'pension',
    title: 'Pensionssparande',
    description: 'Långsiktigt sparande med skatteavdrag. Överväg kapitalförsäkring eller tjänstepension.',
    url: affiliate.pension,
  },
] as const

export function AffiliateSection() {
  const hasAnyLink = ITEMS.some((item) => affiliate[item.id as keyof typeof affiliate])
  if (!hasAnyLink) return null

  return (
    <div className="mt-10 p-6 bg-white rounded-lg border border-stone-200 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-800 mb-1">Kom igång med sparande</h2>
      <p className="text-sm text-stone-500 mb-4">
        Rekommenderade tjänster för att sätta dina beräkningar i verket.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {ITEMS.filter((item) => affiliate[item.id as keyof typeof affiliate]).map((item) => {
          const url = affiliate[item.id as keyof typeof affiliate]
          if (!url) return null
          return (
            <a
              key={item.id}
              href={url}
              target="_blank"
              rel="nofollow sponsored"
              className="block p-4 rounded-lg border border-stone-200 bg-stone-50 transition-colors hover:border-emerald-200 hover:bg-emerald-50/50"
            >
              <h3 className="font-medium text-stone-800">{item.title}</h3>
              <p className="text-sm text-stone-600 mt-1">{item.description}</p>
              <span className="inline-block mt-2 text-sm text-emerald-600 font-medium">
                Läs mer →
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
