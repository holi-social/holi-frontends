import { QueryHookOptions, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import ActSlider from '@holi/core/screens/appsHub/components/ActSlider'
import ActSliderItem from '@holi/core/screens/appsHub/components/ActSliderItem'
import { TrackingEvent } from '@holi/core/tracking'
import { NewspaperFilled } from '@holi/icons/src/generated'

import { GoodNewsArticlesQueryResponse, goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

export const GOOD_NEWS_PAGE_SIZE = 5

type GoodNewsUpdatesProps = {
  locationQuery?: string
  cardWidth: number
}

const GoodNewsUpdates: React.FC<GoodNewsUpdatesProps> = ({ cardWidth }: GoodNewsUpdatesProps) => {
  const { t, i18n } = useTranslation()

  const queryOptions: QueryHookOptions = {
    onError: (error) =>
      logError(error, 'Failed to load good news articles', {
        location: 'GoodNewsUpdates.GoodNewsArticlesQuery',
      }),
  }
  const { data, loading, refetch } = useQuery<GoodNewsArticlesQueryResponse>(goodNewsArticlesQuery)
  useOnRefresh(refetch)
  const isReloading = useRefetchOnClientSideForLoggedInWebUser(goodNewsArticlesQuery, queryOptions)

  const { articles = [] } = data?.appGoodNews_articles || {}

  const articlesToRender = articles.slice(0, GOOD_NEWS_PAGE_SIZE)

  const renderItem = ({ item, index }: { item: GoodNewsArticle; index: number }) => {
    const dateString = getRelativeDateString(item.date, i18n.language)
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)

    const params = new URLSearchParams()
    params.set('articleId', item.id)

    return (
      <ActSliderItem
        name="goodnews"
        to={`/apps/goodnews?${params.toString()}`}
        title={item.headline}
        imageSourceUri={item.pictureUrl}
        footer={formattedDate}
        trackingEvent={TrackingEvent.RecommendationPressed('goodnews', item.id, index)}
        cardWidth={cardWidth}
      />
    )
  }

  return (
    <ActSlider
      name="goodnews"
      renderItem={renderItem}
      data={articlesToRender}
      icon={NewspaperFilled}
      heading={t('goodnews:app.name')}
      subline={t('goodnews:app.subline')}
      seeAllPath="/apps/goodnews"
      labelSeeMore={t('goodnews:goodnewsListing.loadMoreButton.text')}
      loading={loading || isReloading}
      cardWidth={cardWidth}
    />
  )
}

export default withProfiler(GoodNewsUpdates, { name: 'GoodNewsUpdates' })
