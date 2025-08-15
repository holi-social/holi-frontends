import MyPostsTab from '@holi/core/screens/individualPosts/components/MyPostsTab'
import React from 'react'
import { Screen } from '@holi/core/components/Screen'
import { useTranslation } from 'react-i18next'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
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
      preset="fixed"
      headerOptions={{
        title: t('posts.title'),
        headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
      }}
    >
      <Stack padding={{ left: 'sm', right: 'sm' }}>
        <MyPostsTab />
      </Stack>
    </Screen>
  )
}

export default MyPosts
