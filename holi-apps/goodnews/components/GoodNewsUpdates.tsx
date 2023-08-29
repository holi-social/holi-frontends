import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HOLI_APPS, HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'
import { logError } from '@holi/core/errors/helpers'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesItem from '@holi/core/screens/homeFeed/components/AppUpdatesItem'
import AppUpdatesList from '@holi/core/screens/homeFeed/components/AppUpdatesList'
import { FeatureToggleStatus } from '@holi/core/screens/homeFeed/queries'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import { Newspaper, Zzz } from '@holi/icons/src/generated'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import HoliText from '@holi/ui/components/atoms/HoliText'

import { GoodNewsArticlesQuery, GoodNewsArticlesQueryResponse } from '@holi-apps/goodnews/queries'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

export const GOOD_NEWS_PAGE_SIZE = 5

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

  const { loading: ftLoading, status } = useFeatureToggle(FeatureToggleName.APPS_GOODNEWS)
  const ftOff = status === FeatureToggleStatus.OFF
  const ftMaintenance = status === FeatureToggleStatus.MAINTENANCE

  if (ftLoading) {
    return (
      <View style={styles.loader}>
        <HoliLottie animType="loader" />
      </View>
    )
  } else if (ftOff) {
    return
  } else if (ftMaintenance) {
    return (
      <CollaboratorAreaCard
        headerLeftIcon={Zzz}
        title={t('global.maintenance.title', { feature: t('goodnews:maintenance.feature') })}
        disabled={ftMaintenance}
      >
        <HoliText size="small" style={styles.maintenance}>
          {t('global.maintenance.description')}
        </HoliText>
      </CollaboratorAreaCard>
    )
  }

  if (error) {
    logError(error, t('goodnews:goodnewsListing.error'))
  }

  const { articles = [] } = data?.appGoodNews_articles || {}

  const articlesToRender = articles.slice(0, GOOD_NEWS_PAGE_SIZE)

  const renderItem = ({ item }: { item: GoodNewsArticle }) => {
    const dateString = getRelativeDateString(item.date, i18n.language)
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)

    const params = new URLSearchParams()
    params.set('articleId', item.id)

    return (
      <AppUpdatesItem
        appName={HOLI_APPS.GOOD_NEWS}
        onPress={() => navigate(`${HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.GOOD_NEWS].path}?${params.toString()}`)}
        title={item.headline}
        imageSourceUri={item.pictureUrl}
        footer={formattedDate}
      />
    )
  }

  return (
    <AppUpdatesList
      appName={HOLI_APPS.GOOD_NEWS}
      renderItem={renderItem}
      data={articlesToRender}
      appIcon={Newspaper}
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

const styles = StyleSheet.create({
  maintenance: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loader: {
    height: 64,
    width: 64,
    alignSelf: 'center',
    justifyContent: 'center',
  },
})
