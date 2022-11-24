import { useQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import SpacesGrid from '@holi/core/screens/spaces/components/SpacesGrid'
import { SpacesResponse, spacesQuery } from '@holi/core/screens/spaces/queries'
import { topicsQuery } from '@holi/core/screens/spaces/queries'
import { TopicsQueryResult } from '@holi/core/screens/userprofile/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpacesForTopicParams = {
  topicId: string
}

const { useParam } = createParam<SpacesForTopicParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const SPACES_PAGE_SIZE = 20

const SpacesForTopic: React.VFC<ScreenProps> = () => {
  const [topicId] = useParam('topicId')

  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()

  const { data: topicsData } = useQuery<TopicsQueryResult>(topicsQuery)

  const topic = (topicsData?.topics.data || []).find((topic) => topic.id === topicId)

  const fallbackTitle = t('spaces.title')
  useLayoutEffect(() => {
    setOptions({ title: topic?.title || fallbackTitle })
  }, [setOptions, topic, fallbackTitle])

  const { loading, data, error } = useQuery<SpacesResponse>(spacesQuery, {
    variables: {
      topicId: topicId,
      limit: SPACES_PAGE_SIZE,
      offset: 0,
    },
  })

  if (error) {
    logError(error, `[SpacesForTopic.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  const spaces = data?.spaces.data || []

  if (!spaces.length) {
    // TODO: handle not found
    return <></>
  }

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <SpacesGrid style={[mixins.container, styles.grid]} spaces={spaces} />
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 32,
  },
})

export default memo(SpacesForTopic)
