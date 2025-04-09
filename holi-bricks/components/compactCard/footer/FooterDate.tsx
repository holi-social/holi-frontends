import { CalendarEventLine } from '@holi/icons/src/generated'
import { useFormattedCardDates } from 'holi-bricks/components/compactCard/helpers/useFormattedCardDates'
import { ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'

export type FooterDateProps = {
  startDate: string
  endDate?: string
}

export const FooterDate: React.FC<FooterDateProps> = ({ startDate, endDate }) => {
  const formattedCardDates = useFormattedCardDates(new Date(startDate), endDate ? new Date(endDate) : undefined)
  return (
    <ChipLabel size="md" iconLeading={CalendarEventLine}>
      {formattedCardDates}
    </ChipLabel>
  )
}
