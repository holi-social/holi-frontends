import React from 'react'
import { View } from 'react-native'
import { createParam } from 'solito'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export type PostParams = {
  topicId: string
  postId: string
}

const { useParam } = createParam<PostParams>()

const Post: React.VFC = () => {
  const [topicId] = useParam('topicId')
  const [postId] = useParam('postId')

  const { setNavigationHeader } = useNavigationHeader()
  const title = `Post ${postId} in topic ${topicId}`
  setNavigationHeader({
    title: title,
    titleElement: () => (
      <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
        {title}
      </HoliText>
    ),
  })

  if (!topicId) return <HoliText>Missing topicId</HoliText>
  if (!postId) return <HoliText>Missing postId</HoliText>

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

export default Post
