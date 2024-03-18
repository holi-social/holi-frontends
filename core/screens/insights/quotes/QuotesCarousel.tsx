import React, { memo } from 'react'

import QuoteCard from '@holi/core/screens/insights/quotes/QuoteCard'
import { Quote } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import Spacing from '@holi/ui/foundations/Spacing'

export interface QuotesCarouselProps {
  insightId: string
  quotes: Quote[]
}

export const quoteIconColors = ['#FCFE8C', '#BEFC94', '#A3DAFC', '#FFC046']

const QuotesCarousel: React.FC<QuotesCarouselProps> = ({ insightId, quotes }) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={Spacing.xs}
      slides={quotes.map((quote, index) => ({
        children: (
          <QuoteCard.QuoteAndSource
            quote={quote}
            // use next one of the colors sequentially, repeatedly
            quoteColor={quoteIconColors[index % quoteIconColors.length]}
            insightId={insightId}
          />
        ),
      }))}
    />
  )
}

export default memo(QuotesCarousel)
