import MyPostsTab from '@holi/core/screens/individualPosts/components/MyPostsTab'
import React from 'react'
import { Screen } from '@holi/core/components/Screen'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { useFocusEffect } from '@holi/core/helpers/useFocusEffect'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

const MyPosts = () => {
  const { t } = useTranslation()
  const { track } = useTracking()

  useFocusEffect(() => {
    track(TrackingEvent.UserProfile.postsSubpageOpened())
  })

  return (
    <Screen
      headerOptions={{
        title: t('posts.title'),
        headerTitle: ({ children }) => (
          <Text headingLevel="1" size="lg">
            {children}
          </Text>
        ),
      }}
    >
      <Stack padding={{ left: 'sm', right: 'sm' }}>
        <MyPostsTab />
      </Stack>
    </Screen>
  )
}

export default MyPosts
