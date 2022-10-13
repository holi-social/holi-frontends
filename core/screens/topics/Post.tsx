import { useQuery } from '@apollo/client'
import { faker } from '@faker-js/faker'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { userFullName } from '@holi/core/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import { LastInsightsResponse, lastInsightsQuery } from '@holi/core/screens/insights/queries'
import type { Insight } from '@holi/core/screens/insights/types'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostParams = {
  topicId: string
  postId: string
}

const { useParam } = createParam<PostParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Post: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const [topicId] = useParam('topicId')
  const [postId] = useParam('postId')

  const { t } = useTranslation()
  const title = t('topics.post.title', { topicId, postId })
  const mixins = useStyleMixins()

  useNavigationHeader(navigation, { title: title, headerLeft: () => <BackButton /> })

  const { loading, error, data } = useQuery<LastInsightsResponse>(lastInsightsQuery, {
    variables: { numberOfItems: 1 },
  })

  if (error) {
    logError(error, `[Topic.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }
  const insights: Insight[] = data?.lastInsights?.length ? data.lastInsights : fakeTopics
  const topic = insights.find((insight) => insight.id == topicId)
  if (!topic) return <HoliText>{t('topics.topic.notFound', { topicId })}</HoliText>

  // TODO: dummy category
  const category = 'Immigration'

  const author = {
    ...topic.curator,
    fullName: userFullName(topic.curator),
    avatar: faker.image.avatar(), // TODO: dummy image
  }

  return (
    <DefaultLayout>
      <View style={[mixins.container, { justifyContent: 'center', padding: 10 }]}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
        <HoliText style={{ paddingTop: 10 }}>
          <Trans i18nKey="topics.post.author" values={{ author: author.fullName, category: category }} />
        </HoliText>
        <HoliText style={{ paddingTop: 10 }}>{topic.title}</HoliText>
      </View>
    </DefaultLayout>
  )
}

export default Post
