import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesItem from '@holi/core/screens/homeFeed/components/AppUpdatesItem'
import AppUpdatesList from '@holi/core/screens/homeFeed/components/AppUpdatesList'

import { VolunteeringEngagementsQuery, VolunteeringEngagementsQueryResponse } from '@holi-apps/volunteering/queries'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

const ENGAGEMENT_PAGE_SIZE = 5

type VolunteeringUpdatesProps = {
  locationQuery?: string
  style?: StyleProp<ViewStyle>
}

const VolunteeringUpdates: React.VFC<VolunteeringUpdatesProps> = ({ style }: VolunteeringUpdatesProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const { data, error, loading } = useQuery<VolunteeringEngagementsQueryResponse>(VolunteeringEngagementsQuery, {
    variables: {
      offset: 0,
      limit: ENGAGEMENT_PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (error) {
    logError(error, t('volunteering:listing.error'))
  }

  const { data: engagements = [] } = data?.appVolunteering_engagements || {}

  const engagementsToRender = engagements.slice(0, ENGAGEMENT_PAGE_SIZE)

  const renderItem = ({ item }: { item: VolunteeringEngagement }) => {
    const { organizer } = item
    const title = organizer?.name
      ? t('volunteering:engagement.title', { title: item.title, organization: organizer?.name })
      : item.title

    return (
      <AppUpdatesItem
        appName="volunteering"
        onPress={() => navigate(`/apps/volunteering/engagement/${item.id}`)}
        title={title}
        imageSource={{ uri: item.imageUrl }}
      />
    )
  }

  return (
    <AppUpdatesList
      appName="volunteering"
      renderItem={renderItem}
      data={engagementsToRender}
      heading={t('volunteering:app.name')}
      headingIcon="hearts"
      onPressSeeMore={() => navigate('/apps/volunteering/')}
      labelSeeMore={t('volunteering:listing.loadMoreButton.text')}
      loading={loading}
      style={style}
    />
  )
}
export default VolunteeringUpdates
