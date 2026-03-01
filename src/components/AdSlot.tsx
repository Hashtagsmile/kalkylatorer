/**
 * AdSense-komponent
 *
 * Aktivera: Sätt VITE_ADSENSE_CLIENT och VITE_ADSENSE_SLOT_* i .env
 * Se src/config.ts och README för instruktioner.
 */

import { adsense, isAdSenseEnabled } from '../config'

interface AdSlotProps {
  placement: 'top' | 'middle' | 'bottom'
}

const SLOT_MAP = {
  top: adsense.slotTop,
  middle: adsense.slotMiddle,
  bottom: adsense.slotBottom,
} as const

export function AdSlot({ placement }: AdSlotProps) {
  const slot = SLOT_MAP[placement]
  const isEnabled = isAdSenseEnabled && Boolean(slot)

  if (!isEnabled) {
    return null
  }

  return (
    <div className="my-4" data-ad-placement={placement}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsense.client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
