import React, { memo } from 'react'

import QuoteCard from '@holi/core/screens/insights/components/quotes/QuoteCard'
import { Quote } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import spacing from '@holi/ui/foundations/Spacing'

export interface QuotesCarouselProps {
  insightId: string
  quotes: Quote[]
}

const QuotesCarousel: React.FC<QuotesCarouselProps> = ({ insightId, quotes }) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={spacing.xs}
      slides={quotes.map((quote) => {
        return {
          children: <QuoteCard quote={quote} insightId={insightId} />,
        }
      })}
    />
  )
}

export default memo(QuotesCarousel)
