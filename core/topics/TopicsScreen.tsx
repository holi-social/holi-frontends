import React from 'react'
import { Text, View } from 'react-native'
import { createParam } from 'solito'

import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
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
      <HoliHeading level={1}>Topic topicId={topicId}</HoliHeading>

      <HoliButton label="Topic Editors" inline onPress={() => navigate(`/topics/${topicId}/editors`)}>
        Topic Editors
      </HoliButton>
      <Text style={{ fontSize: 24, paddingBottom: 10 }}>{topic.title}</Text>
      <Text style={{ paddingBottom: 10 }}>{topic.text}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Posts</Text>
      {[...Object.getOwnPropertyNames(topic.posts)].map((postId) => (
        <HoliButton
          key={postId}
          label={topic.posts[postId].text}
          inline
          transparent
          onPress={() => navigate(`/topics/${topicId}/posts/${postId}`)}
        >
          <Text style={{ paddingTop: 10 }}>{topic.posts[postId].text}</Text>
        </HoliButton>
      ))}
    </View>
  )
}
