import React, { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { createParam } from 'solito'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import TopicEditors from '@holi/core/screens/topics/components/TopicEditors'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { useTheme } from '@holi/ui/styles/theme'

export type TopicParams = {
  topicId: string
}
const { useParam } = createParam<TopicParams>()

type TopicProps = NativeStackScreenProps<HomeStackScreens>

const Topic: React.VFC<TopicProps> = ({ navigation }: TopicProps) => {
  const [showModal, setShowModal] = useState(false)
  const [topicId = ''] = useParam('topicId')
  const { navigate } = useRouting()
  const { setBackLink, clearBackLinks } = useNavigationContext()
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { setNavigationHeader } = useNavigationHeader()
  useLayoutEffect(() => {
    const title = t('topics.topic.title', { title: topicId })
    setNavigationHeader({
      title: title,
      titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
    })
    setBackLink('left')
    return () => clearBackLinks()
  }, [navigation, topicId, t, clearBackLinks, setBackLink, setNavigationHeader])

  // Important: `fakeTopics.get(topicId) should be called after useEffect() or useLayoutEffet()
  // A hard reload will cause an error.
  // see here: https://reactjs.org/docs/hooks-rules.html
  const topic = fakeTopics.get(topicId)
  if (!topic) return <HoliText>{t('topics.topic.notFound', { topicId })}</HoliText>

  return (
    <DefaultLayout>
      <View style={[theme.mixins.container, styles.topicView]}>
        <HoliHeading level="1" size="super" style={{ alignSelf: 'center' }}>
          {t('topics.topic.heading', { title: topic.title, topicId })}
        </HoliHeading>

        <HoliButton
          label={t('topics.topic.topicEditors', { title: topicId })}
          inline
          onPress={() => setShowModal(true)}
        >
          {t('topics.topic.topicEditors', { title: topicId })}
        </HoliButton>

        <HoliText>{topic.text}</HoliText>

        <HoliHeading level="3">{t('topics.topic.posts')}</HoliHeading>

        {[...Object.getOwnPropertyNames(topic.posts)].map((postId) => (
          <HoliButton
            key={postId}
            label={topic.posts[postId].text}
            transparent
            style={styles.post}
            onPress={() => navigate(`/topics/${topicId}/posts/${postId}`)}
          >
            <HoliText>{topic.posts[postId].text}</HoliText>
          </HoliButton>
        ))}

        <HoliModal
          show={showModal}
          onDismiss={() => {
            setShowModal(false)
          }}
        >
          <TopicEditors topicId={topicId || ''}></TopicEditors>
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
