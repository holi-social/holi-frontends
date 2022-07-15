import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { createParam } from 'solito'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useNavigationContext } from '@holi/core/navigation/context'
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
  const { setBackLink, clearBackLinks } = useNavigationContext()
  const { t } = useTranslation()
  const title = t('topics.post.title', { topicId, postId })

  useLayoutEffect(() => {
    setNavigationHeader({
      title: title,
      titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
    })
    setBackLink('left')
    return () => clearBackLinks()
  }, [navigation, topicId, postId])

  if (!topicId) return <HoliText>{t('topics.post.missingTopicId')}</HoliText>
  if (!postId) return <HoliText>{t('topics.post.missingPostId')}</HoliText>

  return (
    <DefaultLayout>
      <View style={{ justifyContent: 'center', padding: 10 }}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
        <HoliText style={{ paddingTop: 10 }}>
          {t('topics.post.author', { author: fakeTopics.get(topicId).posts[postId].author })}
        </HoliText>
        <HoliText style={{ paddingTop: 10 }}>{fakeTopics.get(topicId).posts[postId].text}</HoliText>
      </View>
    </DefaultLayout>
  )
}

export default Post
