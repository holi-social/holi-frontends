import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { HOLI_APPS, HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'
import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesItem from '@holi/core/screens/homeFeed/components/AppUpdatesItem'
import AppUpdatesList from '@holi/core/screens/homeFeed/components/AppUpdatesList'
import { Hearts } from '@holi/icons/src/generated'

import { VolunteeringEngagementsQuery, VolunteeringEngagementsQueryResponse } from '@holi-apps/volunteering/queries'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

export const ENGAGEMENT_PAGE_SIZE = 5

type VolunteeringUpdatesProps = {
  locationQuery?: string
  style?: StyleProp<ViewStyle>
}

const VolunteeringUpdates: React.VFC<VolunteeringUpdatesProps> = ({ style }: VolunteeringUpdatesProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const { data, loading } = useQuery<VolunteeringEngagementsQueryResponse>(VolunteeringEngagementsQuery, {
    variables: {
      offset: 0,
      limit: ENGAGEMENT_PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
    onError: (error) =>
      logError(error, 'Failed to load volunteering engagements', {
        location: 'VolunteeringUpdates.VolunteeringEngagementsQuery',
      }),
  })

  const { data: engagements = [] } = data?.appVolunteering_engagementOpportunities || {}

  const engagementsToRender = engagements.slice(0, ENGAGEMENT_PAGE_SIZE)

  const renderItem = ({ item }: { item: VolunteeringEngagement }) => {
    const { organizer } = item
    const title = organizer?.name
      ? t('volunteering:engagement.title', {
          title: item.title,
          organization: organizer?.name,
          interpolation: { escapeValue: false },
        })
      : item.title

    return (
      <AppUpdatesItem
        appName={HOLI_APPS.VOLUNTEERING}
        onPress={() => navigate(`${HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.VOLUNTEERING].path}/engagement/${item.id}`)}
        title={title}
        imageSourceUri={item.imageUrl}
        footer={item.source}
      />
    )
  }

  return (
    <AppUpdatesList
      appName={HOLI_APPS.VOLUNTEERING}
      renderItem={renderItem}
      data={engagementsToRender}
      appIcon={Hearts}
      heading={t('volunteering:app.name')}
      subline={t('volunteering:app.subline')}
      onPressSeeMore={() => navigate(HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.VOLUNTEERING].path)}
      labelSeeMore={t('volunteering:listing.loadMoreButton.text')}
      loading={loading}
      style={style}
    />
  )
}

export default withProfiler(VolunteeringUpdates, { name: 'VolunteeringUpdates' })
