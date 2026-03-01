export function PrintResultButton() {
  const handlePrint = () => {
    const details = document.getElementById('year-table-details')
    if (details) {
      details.setAttribute('open', '')
      const onAfterPrint = () => {
        details.removeAttribute('open')
        window.removeEventListener('afterprint', onAfterPrint)
      }
      window.addEventListener('afterprint', onAfterPrint)
    }
    window.print()
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors focus:outline-none focus:underline print:hidden"
      aria-label="Skriv ut resultatet"
    >
      <PrintIcon aria-hidden />
      Skriv ut
    </button>
  )
}

function PrintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}
