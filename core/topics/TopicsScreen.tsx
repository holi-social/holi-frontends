import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createParam } from 'solito'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliModal from '@holi/ui/components/HoliModal'

import { fakeTopics } from './fakeTopics'

const { useParam } = createParam<TopicScreenParams>()

export type TopicScreenParams = {
  topicId: string
}

export const TopicsScreen: React.VFC = () => {
  const [show, setShow] = useState(false)
  const [topicId] = useParam('topicId')
  const { navigate } = useRouting()
  const topic = fakeTopics.get(topicId)
  if (!topic) return <Text>Topic {topicId} not found</Text>
  return (
    <View style={styles.topicView}>
      <HoliHeading level={1}>Topic topicId={topicId}</HoliHeading>

      <HoliButton label="Topic Editors" inline onPress={() => setShow(true)}>
        Topic Editors
      </HoliButton>

      <Text style={{ fontSize: 24, paddingBottom: 10 }}>{topic.title}</Text>
      <Text style={styles.text}>{topic.text}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Posts</Text>
      {[...Object.getOwnPropertyNames(topic.posts)].map((postId) => (
        <HoliButton
          key={postId}
          label={topic.posts[postId].text}
          inline
          transparent
          style={styles.post}
          onPress={() => navigate(`/topics/${topicId}/posts/${postId}`)}
        >
          <Text>{topic.posts[postId].text}</Text>
        </HoliButton>
      ))}
      <HoliModal
        show={show}
        onDismiss={() => {
          setShow(false)
        }}
      ></HoliModal>
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
