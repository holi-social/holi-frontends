import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { HOLI_APPS, HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'
import { logError } from '@holi/core/errors/helpers'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesItem from '@holi/core/screens/appsHub/components/AppUpdatesItem'
import AppUpdatesList from '@holi/core/screens/appsHub/components/AppUpdatesList'
import { TrackingEvent } from '@holi/core/tracking'
import { NewspaperFilled } from '@holi/icons/src/generated'

import { GoodNewsArticlesQueryResponse, goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

export const GOOD_NEWS_PAGE_SIZE = 5

type GoodNewsUpdatesProps = {
  locationQuery?: string
  style?: StyleProp<ViewStyle>
}

const GoodNewsUpdates: React.FC<GoodNewsUpdatesProps> = ({ style }: GoodNewsUpdatesProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()

  const { data, loading } = useQuery<GoodNewsArticlesQueryResponse>(goodNewsArticlesQuery, {
    onError: (error) =>
      logError(error, 'Failed to load good news articles', {
        location: 'GoodNewsUpdates.GoodNewsArticlesQuery',
      }),
  })

  const { articles = [] } = data?.appGoodNews_articles || {}

  const articlesToRender = articles.slice(0, GOOD_NEWS_PAGE_SIZE)

  const renderItem = ({ item, index }: { item: GoodNewsArticle; index: number }) => {
    const dateString = getRelativeDateString(item.date, i18n.language)
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)

    const params = new URLSearchParams()
    params.set('articleId', item.id)

    return (
      <AppUpdatesItem
        appName={HOLI_APPS.GOOD_NEWS}
        to={`${HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.GOOD_NEWS].path}?${params.toString()}`}
        title={item.headline}
        imageSourceUri={item.pictureUrl}
        footer={formattedDate}
        trackingEvent={TrackingEvent.RecommendationPressed('goodnews', item.id, index)}
      />
    )
  }

  return (
    <AppUpdatesList
      appName={HOLI_APPS.GOOD_NEWS}
      renderItem={renderItem}
      data={articlesToRender}
      appIcon={NewspaperFilled}
      heading={t('goodnews:app.name')}
      subline={t('goodnews:app.subline')}
      onPressSeeMore={() => navigate(HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.GOOD_NEWS].path)}
      labelSeeMore={t('goodnews:goodnewsListing.loadMoreButton.text')}
      loading={loading}
      style={style}
    />
  )
}

export default withProfiler(GoodNewsUpdates, { name: 'GoodNewsUpdates' })
