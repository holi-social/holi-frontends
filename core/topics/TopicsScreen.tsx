import React from 'react'
import { Button, Pressable, Text, View } from 'react-native'
import { createParam } from 'solito'

import useRouting from '@holi/ui/components/navigation/useRouting'

import { fakeTopics } from './fakeTopics'

const { useParam } = createParam<TopicScreenParams>()

export type TopicScreenParams = {
  topicId: string
}

export const TopicsScreen: React.VFC = () => {
  const [topicId] = useParam('topicId')
  const { navigate } = useRouting()
  const topic = fakeTopics.get(topicId)
  if (!topic) return <Text>Topic {topicId} not found</Text>
  return (
    <View style={{ padding: 10 }}>
      <Text>Topic topicId={topicId}</Text>
      <Button onPress={() => navigate(`/topics/${topicId}/editors`)} title="Topic Editors" />
      <Text style={{ fontSize: 24, paddingBottom: 10 }}>{topic.title}</Text>
      <Text style={{ paddingBottom: 10 }}>{topic.text}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Posts</Text>
      {[...Object.getOwnPropertyNames(topic.posts)].map((postId) => (
        <Pressable key={postId} onPress={() => navigate(`/topics/${topicId}/posts/${postId}`)}>
          <Text style={{ paddingTop: 10 }}>{topic.posts[postId].text}</Text>
        </Pressable>
      ))}
    </View>
  )
}
