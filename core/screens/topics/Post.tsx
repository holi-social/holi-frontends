import React, { useLayoutEffect } from 'react'
import { View } from 'react-native'
import { createParam } from 'solito'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'

export type PostParams = {
  topicId: string
  postId: string
}

const { useParam } = createParam<PostParams>()

type PostProps = NativeStackScreenProps<HomeStackScreens>

const Post: React.VFC<PostProps> = ({ navigation }: PostProps) => {
  const [topicId] = useParam('topicId')
  const [postId] = useParam('postId')

  const { setNavigationHeader } = useNavigationHeader()

  useLayoutEffect(() => {
    const title = `Post ${postId} in topic ${topicId}`
    setNavigationHeader({
      title: title,
      titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
    })
  }, [navigation])

  if (!topicId) return <HoliText>Missing topicId</HoliText>
  if (!postId) return <HoliText>Missing postId</HoliText>

  return (
    <View style={{ justifyContent: 'center', padding: 10 }}>
      <HoliHeading level="1" size="super">
        Topic {topicId} Post {postId}
      </HoliHeading>
      <HoliText styles={{ paddingTop: 10 }}>by {fakeTopics.get(topicId).posts[postId].author}</HoliText>
      <HoliText styles={{ paddingTop: 10 }}>{fakeTopics.get(topicId).posts[postId].text}</HoliText>
    </View>
  )
}

export default Post
