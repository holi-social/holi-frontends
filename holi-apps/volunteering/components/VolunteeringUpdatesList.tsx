import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { HOLI_APPS, HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesItem from '@holi/core/screens/appsHub/components/AppUpdatesItem'
import AppUpdatesList from '@holi/core/screens/appsHub/components/AppUpdatesList'
import { TrackingEvent } from '@holi/core/tracking'
import { HeartsFilled } from '@holi/icons/src/generated'

import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringUpdatesListProps = {
  style?: StyleProp<ViewStyle>
  engagements: VolunteeringEngagement[]
  loading: boolean
}

const VolunteeringUpdatesList: React.FC<VolunteeringUpdatesListProps> = ({ style, loading, engagements }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const renderItem = ({ item, index }: { item: VolunteeringEngagement; index: number }) => {
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
        to={`${HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.VOLUNTEERING].path}/${item.id}`}
        title={title}
        imageSourceUri={item.imageUrl}
        footer={item.source}
        trackingEvent={TrackingEvent.RecommendationPressed('volunteering_opportunity', item.id, index)}
      />
    )
  }

  return (
    <AppUpdatesList
      appName={HOLI_APPS.VOLUNTEERING}
      renderItem={renderItem}
      data={engagements}
      appIcon={HeartsFilled}
      heading={t('volunteering:app.name')}
      subline={t('volunteering:app.subline')}
      onPressSeeMore={() => navigate(HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.VOLUNTEERING].path)}
      labelSeeMore={t('volunteering:listing.loadMoreButton.text')}
      loading={loading}
      style={style}
    />
  )
}

export default VolunteeringUpdatesList
