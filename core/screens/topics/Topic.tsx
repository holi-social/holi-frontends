import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { createParam } from 'solito'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import TopicEditors from '@holi/core/screens/topics/components/TopicEditors'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliModal from '@holi/ui/components/HoliModal'
import HoliReadMore from '@holi/ui/components/HoliReadMore'
import HoliText from '@holi/ui/components/HoliText'

export type TopicParams = {
  topicId: string
}
const { useParam } = createParam<TopicParams>()

type TopicProps = NativeStackScreenProps<HomeStackScreens>

const Topic: React.VFC<TopicProps> = ({ navigation }: TopicProps) => {
  const [showModal, setShowModal] = useState(false)
  const [topicId = ''] = useParam('topicId')
  const { navigate } = useRouting()

  const { setNavigationHeader } = useNavigationHeader()
  useLayoutEffect(() => {
    const title = `Topic ${topicId}`
    setNavigationHeader({
      title: title,
      titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
    })
  }, [navigation])

  // Important: `fakeTopics.get(topicId) should be called after useEffect() or useLayoutEffet()
  // A hard reload will cause an error.
  // see here: https://reactjs.org/docs/hooks-rules.html
  const topic = fakeTopics.get(topicId)
  if (!topic) return <HoliText>Topic {topicId} not found</HoliText>

  return (
    <View style={styles.topicView}>
      <HoliHeading level="1" size="super" styles={{ alignSelf: 'center' }}>
        Topic topicId={topicId}
      </HoliHeading>

      <HoliButton label="Topic Editors" inline onPress={() => setShowModal(true)}>
        Topic Editors
      </HoliButton>

      <HoliHeading level="1" styles={{ paddingBottom: 10 }}>
        {topic.title}
      </HoliHeading>
      <HoliText>{topic.text}</HoliText>
      {/* <View style={{ marginBottom: 10 }}>
        <HoliReadMore numberOfLines={2}>{topic.text}</HoliReadMore>
      </View> */}
      <HoliHeading level="3">Posts</HoliHeading>
      {[...Object.getOwnPropertyNames(topic.posts)].map((postId) => (
        <HoliButton
          key={postId}
          label={topic.posts[postId].text}
          inline
          variant="transparent"
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
