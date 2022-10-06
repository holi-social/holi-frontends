import { useQuery } from '@apollo/client'
import { LastInsightsResponse, lastInsightsQuery } from 'core/screens/homeFeed/queries'
import { Insight } from 'core/screens/topics/types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import TopicEditors from '@holi/core/screens/topics/components/TopicEditors'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type TopicParams = {
  topicId: string
}
const { useParam } = createParam<TopicParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Topic: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const [showModal, setShowModal] = useState(false)
  const [topicId = ''] = useParam('topicId')
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const numberOfItems = 2

  useNavigationHeader(navigation, {
    title: t('topics.topic.title', { title: topicId }),
    headerLeft: () => <BackButton />,
  })

  const { loading, error, data } = useQuery<LastInsightsResponse>(lastInsightsQuery, {
    variables: { numberOfItems },
  })

  if (error) {
    logError(error, `[Topic.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  const insights: Insight[] = data?.lastInsights?.length ? data.lastInsights : fakeTopics

  // Important: `insights.find() should be called after useEffect() or useLayoutEffet()
  // A hard reload will cause an error.
  // see here: https://reactjs.org/docs/hooks-rules.html
  const topic = insights.find((insight) => insight.id == topicId)
  if (!topic) return <HoliText>{t('topics.topic.notFound', { topicId })}</HoliText>

  return (
    <DefaultLayout>
      <View style={[mixins.container, styles.topicView]}>
        <HoliHeading level="1" size="super" style={{ alignSelf: 'center' }} testID="topic-headline">
          {t('topics.topic.heading', { title: topic.title, topicId })}
        </HoliHeading>

        <HoliButton
          label={t('topics.topic.editors', { title: topicId })}
          inline
          onPress={() => setShowModal(true)}
          testID="show-editors"
        >
          {t('topics.topic.editors', { title: topicId })}
        </HoliButton>

        <HoliText>{topic.description}</HoliText>

        <HoliHeading level="3">{t('topics.topic.posts')}</HoliHeading>

        {topic.posts.map((post) => (
          <HoliButton
            key={post.id}
            label={post.text}
            transparent
            style={styles.post}
            onPress={() => navigate(`/topics/${topicId}/posts/${post.id}`)}
          >
            <HoliText>{post.text}</HoliText>
          </HoliButton>
        ))}

        <HoliModal
          label={t('topics.topic.editors.title', { topicId })}
          show={showModal}
          minRelativeHeight={0.5}
          onDismiss={() => {
            setShowModal(false)
          }}
        >
          <TopicEditors topicId={topicId || ''} />
        </HoliModal>
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  topicView: {
    padding: 10,
    flex: 1,
  },
  text: {
    paddingBottom: 10,
  },
  post: {
    borderWidth: 1,
    borderColor: 'pink',
  },
})

export default Topic
