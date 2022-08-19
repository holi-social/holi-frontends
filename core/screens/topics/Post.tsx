import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { createParam } from 'solito'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostParams = {
  topicId: string
  postId: string
}

const { useParam } = createParam<PostParams>()

type PostProps = NativeStackScreenProps<HomeStackScreens>

const Post: React.VFC<PostProps> = ({ navigation }: PostProps) => {
  const [topicId] = useParam('topicId')
  const [postId] = useParam('postId')

  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { navigateBack } = useRouting()
  const { t } = useTranslation()
  const title = t('topics.post.title', { topicId, postId })
  const mixins = useStyleMixins()

  useLayoutEffect(
    () => {
      setNavigationHeader({
        title: title,
        titleElement: () => (
          <HoliText bold style={{ paddingTop: 5 }}>
            {title}
          </HoliText>
        ),
        headerLeft: () => (
          <HoliButton
            label={t('navigation.headerLeft.back')}
            inline
            transparent
            onPress={() => navigateBack()}
            style={{ paddingHorizontal: 0 }}
          >
            <HoliIcon icon="arrow-down-s" size={30} />
          </HoliButton>
        ),
      })
      return clearNavigationHeader
    },
    // setNavigationHeader would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation, topicId, postId, title]
  )

  if (!topicId) return <HoliText>{t('topics.post.missingTopicId')}</HoliText>
  if (!postId) return <HoliText>{t('topics.post.missingPostId')}</HoliText>

  return (
    <DefaultLayout>
      <View style={[mixins.container, { justifyContent: 'center', padding: 10 }]}>
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
