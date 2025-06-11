import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import type React from 'react'
import { useTranslation } from 'react-i18next'

import RecoSlider from '@holi/core/components/RecoSlider'
import RecoSliderCard from '@holi/core/components/RecoSliderCard'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { TrackingEvent } from '@holi/core/tracking'
import { NewspaperFilled } from '@holi/icons/src/generated'

import { type GoodNewsArticlesQueryResponse, goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'

export const GOOD_NEWS_PAGE_SIZE = 5

type GoodNewsUpdatesProps = {
  locationQuery?: string
  cardWidth: number
}

const GoodNewsUpdates: React.FC<GoodNewsUpdatesProps> = ({ cardWidth }: GoodNewsUpdatesProps) => {
  const { t, i18n } = useTranslation()

  const { data, loading, refetch } = useQuery<GoodNewsArticlesQueryResponse>(goodNewsArticlesQuery)
  useOnRefresh(refetch)

  const { articles = [] } = data?.appGoodNews_articles || {}

  const articlesToRender = articles.slice(0, GOOD_NEWS_PAGE_SIZE)

  const renderItem = ({ item, index }: { item: GoodNewsArticle; index: number }) => {
    const dateString = getRelativeDateString(item.date, i18n.language)
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)

    const params = new URLSearchParams()
    params.set('articleId', item.id)

    return (
      <RecoSliderCard
        name="goodnews"
        to={`/goodnews?${params.toString()}`}
        title={item.headline}
        imageSourceUri={item.pictureUrl}
        footer={formattedDate}
        trackingEvent={TrackingEvent.RecommendationPressed('goodnews', item.id, index)}
        cardWidth={cardWidth}
      />
    )
  }

  return (
    <RecoSlider
      name="goodnews"
      renderItem={renderItem}
      data={articlesToRender}
      icon={NewspaperFilled}
      heading={t('goodnews:app.name')}
      subline={t('goodnews:app.subline')}
      seeAllPath="/goodnews"
      labelSeeMore={t('goodnews:goodnewsListing.loadMoreButton.text')}
      loading={loading}
    />
  )
}

export default withProfiler(GoodNewsUpdates, { name: 'GoodNewsUpdates' })
