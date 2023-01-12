import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesList from '@holi/core/screens/homeFeed/components/AppUpdatesList'

import GoodNewsUpdatesItem from '@holi-apps/goodnews/components/GoodNewsUpdatesItem'
import { GoodNewsArticlesQuery, GoodNewsArticlesQueryResponse } from '@holi-apps/goodnews/queries'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

const PROJECT_PAGE_SIZE = 5

type GoodNewsUpdatesProps = {
  locationQuery?: string
  style?: StyleProp<ViewStyle>
}

const GoodNewsUpdates: React.VFC<GoodNewsUpdatesProps> = ({ style }: GoodNewsUpdatesProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const { data, error, loading } = useQuery<GoodNewsArticlesQueryResponse>(GoodNewsArticlesQuery, {
    fetchPolicy: 'cache-and-network',
  })

  if (error) {
    logError(error, t('goodnews:goodnewsListing.error'))
  }

  const { articles = [] } = data?.appGoodNews_articles || {}

  const articlesToRender = articles.slice(0, PROJECT_PAGE_SIZE)

  const renderItem = ({ item, index }: { item: GoodNewsArticle; index: number }) => {
    return <GoodNewsUpdatesItem key={index} article={item} />
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
