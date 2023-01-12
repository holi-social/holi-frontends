import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesItem from '@holi/core/screens/homeFeed/components/AppUpdatesItem'
import AppUpdatesList from '@holi/core/screens/homeFeed/components/AppUpdatesList'

import { GoodNewsArticlesQuery, GoodNewsArticlesQueryResponse } from '@holi-apps/goodnews/queries'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

const PROJECT_PAGE_SIZE = 5

type GoodNewsUpdatesProps = {
  locationQuery?: string
  style?: StyleProp<ViewStyle>
}

const GoodNewsUpdates: React.VFC<GoodNewsUpdatesProps> = ({ style }: GoodNewsUpdatesProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()

  const { data, error, loading } = useQuery<GoodNewsArticlesQueryResponse>(GoodNewsArticlesQuery, {
    fetchPolicy: 'cache-and-network',
  })

  if (error) {
    logError(error, t('goodnews:goodnewsListing.error'))
  }

  const { articles = [] } = data?.appGoodNews_articles || {}

  const articlesToRender = articles.slice(0, PROJECT_PAGE_SIZE)

  const renderItem = ({ item }: { item: GoodNewsArticle }) => {
    const dateString = getRelativeDateString(item.date, i18n.language)
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)

    return (
      <AppUpdatesItem
        appName="goodnews"
        onPress={() => navigate('/apps/goodnews?')}
        title={item.headline}
        imageSource={{ uri: item.pictureUrl }}
        footer={formattedDate}
      />
    )
  }

  return (
    <AppUpdatesList
      appName="goodnews"
      renderItem={renderItem}
      data={articlesToRender}
      heading={t('goodnews:app.name')}
      headingIcon="newspaper"
      onPressSeeMore={() => navigate('/apps/goodnews/')}
      labelSeeMore={t('goodnews:goodnewsListing.loadMoreButton.text')}
      loading={loading}
      style={style}
    />
  )
}
export default GoodNewsUpdates
