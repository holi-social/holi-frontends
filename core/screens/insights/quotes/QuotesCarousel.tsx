import type React from 'react'
import { memo } from 'react'

import QuoteCard from '@holi/core/screens/insights/quotes/QuoteCard'
import type { Quote } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export interface QuotesCarouselProps {
  insightId: string
  marginHorizontal: number
  slideWidth?: number
  quotes: Quote[]
}

export const quoteIconColors = ['#FCFE8C', '#BEFC94', '#A3DAFC', '#FFC046']

const QuotesCarousel: React.FC<QuotesCarouselProps> = ({ insightId, quotes, marginHorizontal, slideWidth }) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={marginHorizontal}
      slideWidth={slideWidth}
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
