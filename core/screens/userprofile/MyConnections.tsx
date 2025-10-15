import React from 'react'
import { Screen } from '@holi/core/components/Screen'
import { useTranslation } from 'react-i18next'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import OwnConnectionsTab from '@holi/core/screens/userprofile/components/OwnConnectionsTab'
import { Stack } from 'holi-bricks/components/stack'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useFocusEffect } from '@holi/core/helpers/useFocusEffect'
import { TrackingEvent } from '@holi/core/tracking'

const MyConnections = () => {
  const { t } = useTranslation()
  const { track } = useTracking()

  useFocusEffect(() => {
    track(TrackingEvent.UserProfile.connectionsSubpageOpened())
  })

  return (
    <Screen
      headerOptions={{
        title: t('connections.title'),
        headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
      }}
    >
      <Stack padding="xs">
        <OwnConnectionsTab emptyText={t('user.profile.own.connections.title.empty')} />
      </Stack>
    </Screen>
  )
}

export default MyConnections
