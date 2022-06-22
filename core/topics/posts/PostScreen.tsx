import React from 'react'
import { Text, View } from 'react-native'
import { createParam } from 'solito'

import { fakeTopics } from '@holi/core/topics/fakeTopics'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

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
      <HoliText type={HoliTextType.super}>
        Topic {topicId} Post {postId}
      </HoliText>
      <HoliText type={HoliTextType.body} styles={{ paddingTop: 10 }}>
        by {fakeTopics.get(topicId).posts[postId].author}
      </HoliText>
      <HoliText type={HoliTextType.body} styles={{ paddingTop: 10 }}>
        {fakeTopics.get(topicId).posts[postId].text}
      </HoliText>
    </View>
  )
}
