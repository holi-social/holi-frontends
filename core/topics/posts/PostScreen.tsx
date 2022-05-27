import React from 'react'
import { Text, View } from 'react-native'
import { createParam } from 'solito'

import { fakeTopics } from '@holi/core/topics/fakeTopics'

export type PostScreenParams = {
  topicId: string
  postId: string
}

const { useParam } = createParam<PostScreenParams>()

export const PostScreen: React.VFC = () => {
  const [topicId] = useParam('topicId')
  const [postId] = useParam('postId')

  if (!topicId) return <Text>Missing topicId</Text>
  if (!postId) return <Text>Missing postId</Text>

  return (
    <View style={{ justifyContent: 'center', padding: 10 }}>
      <Text>
        Topic {topicId} Post {postId}
      </Text>
      <Text style={{ paddingTop: 10 }}>by {fakeTopics.get(topicId).posts[postId].author}</Text>
      <Text style={{ paddingTop: 10 }}>{fakeTopics.get(topicId).posts[postId].text}</Text>
    </View>
  )
}
