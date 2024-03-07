import React, { memo } from 'react'

import QuoteCard from '@holi/core/screens/insights/components/quotes/QuoteCard'
import { Quote } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export interface QuotesCarouselProps {
  quotes: Quote[]
}

const QuotesCarousel: React.FC<QuotesCarouselProps> = ({ quotes }) => {
  return (
    <HoliCarousel
      hideDotIndicators
      slides={quotes.map((quote) => {
        return {
          children: <QuoteCard quote={quote} />,
        }
      })}
    />
  )
}

export default memo(QuotesCarousel)
