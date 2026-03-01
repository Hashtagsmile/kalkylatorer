interface DisclaimerProps {
  /** Kalkylatorspecifik text. Default: investeringsrådgivning. */
  variant?: 'default' | 'loan' | 'salary' | 'general'
}

const VARIANTS: Record<NonNullable<DisclaimerProps['variant']>, string> = {
  default: `Denna kalkylator är endast en simulering och utgör inte investeringsrådgivning. Resultatet bygger på antaganden om framtida avkastning, som inte kan garanteras. Inga garantier ges för att de angivna siffrorna kommer att uppnås. Vid investeringsbeslut rekommenderas att du söker professionell rådgivning. Användaren ansvarar själv för sina beslut.`,
  loan: `Beräkningen är en uppskattning. Ingen kreditprövning eller bindande offert. Kontakta din bank för exakt ränta och villkor. Användaren ansvarar själv för sina beslut.`,
  salary: `Beräkningen är förenklad. Den inkluderar inte RUT-avdrag, reseavdrag eller andra specialfall. För officiell beräkning, använd Skatteverkets e-tjänst. Användaren ansvarar själv för sina beslut.`,
  general: `Denna kalkylator är endast en uppskattning. Siffror kan variera. Inga garantier ges. Användaren ansvarar själv för sina beslut.`,
}

export function Disclaimer({ variant = 'default' }: DisclaimerProps) {
  return (
    <p className="text-sm text-stone-500 leading-relaxed border-l-2 border-stone-200 pl-4">
      {VARIANTS[variant]}
    </p>
  )
}
