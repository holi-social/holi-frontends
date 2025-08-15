import React from 'react'
import { Screen } from '@holi/core/components/Screen'
import { useTranslation } from 'react-i18next'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { Text } from 'holi-bricks/components/text'
import SpacesTab from '@holi/core/components/SpacesTab'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { Stack } from 'holi-bricks/components/stack'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useFocusEffect } from '@holi/core/helpers/useFocusEffect'
import { TrackingEvent } from '@holi/core/tracking'

const MySpaces = () => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const { track } = useTracking()

  useFocusEffect(() => {
    track(TrackingEvent.UserProfile.spacesSubpageOpened())
  })

  if (!user) {
    return (
      <DefaultLayout>
        <Stack alignItems="center" alignSelf="center">
          <Text size="md">{t('user.profileView.noUser')}</Text>
        </Stack>
      </DefaultLayout>
    )
  }

  return (
    <Screen
      preset="fixed"
      headerOptions={{
        title: t('spaces.title'),
        headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
      }}
    >
      <Stack padding="xs">
        <SpacesTab
          emptyText={t('profile.tabs.spaces.empty')}
          emptyCallToAction={t('profile.tabs.spaces.empty.callToAction')}
          memberId={user.id}
        />
      </Stack>
    </Screen>
  )
}

export default MySpaces
