import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type TopicParams = {
  topicId: string
}
const { useParam } = createParam<TopicParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Topic: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const [topicId = ''] = useParam('topicId')
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  useNavigationHeader(navigation, {
    title: t('topics.topic.title', { title: topicId }),
    headerLeft: (props) => <BackButton {...props} icon="arrow-down-s" />,
  })

  // Important: `fakeTopics.get(topicId) should be called after useEffect() or useLayoutEffet()
  // A hard reload will cause an error.
  // see here: https://reactjs.org/docs/hooks-rules.html
  const topic = fakeTopics.get(topicId)
  if (!topic) return <HoliText>{t('topics.topic.notFound', { topicId })}</HoliText>

  return (
    <>
      <StatusBar style="light" animated={true} />

      <ScrollView bounces={false} style={styles.wrapper}>
        <View>
          <ImageBackground source={{ uri: topic.image.src }} resizeMode="cover" style={{ height: 340 }} />
        </View>

        <View style={[mixins.container, styles.topicView]}>
          <HoliHeading size="xSmall" style={styles.categoryHeadline} testID="topic-category">
            Immigration
          </HoliHeading>

          <HoliHeading level="1" size="super" style={styles.topicHeadline} testID="topic-headline">
            {topic.title}
          </HoliHeading>

          <HoliText style={styles.topicText}>{topic.text}</HoliText>

          {/* {[...Object.getOwnPropertyNames(topic.posts)].map((postId) => (
          <HoliButton
            key={postId}
            label={topic.posts[postId].text}
            transparent
            style={styles.post}
            onPress={() => navigate(`/topics/${topicId}/posts/${postId}`)}
          >
            <HoliText>{topic.posts[postId].text}</HoliText>
          </HoliButton>
        ))}

        <HoliModal
          label={t('topics.topic.editors.title', { topicId })}
          show={showModal}
          minRelativeHeight={0.5}
          onDismiss={() => {
            setShowModal(false)
          }}
        >
          <TopicEditors topicId={topicId || ''} />
        </HoliModal> */}
        </View>

        {/* TODO: remove after adding posts */}
        <View style={{ marginBottom: 1000 }} />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundColorGreyDark,
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 104,
    zIndex: 10,
  },
  topicView: {
    backgroundColor: colors.backgroundColorWhite,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 40,
    paddingBottom: 24,
    marginBottom: 24,
  },
  categoryHeadline: {
    color: colors.positivepurple,
    marginBottom: 8,
  },
  topicHeadline: {
    marginBottom: 24,
  },
  topicText: {
    color: colors.grey,
    marginBottom: 24,
  },
  post: {
    borderWidth: 1,
    borderColor: 'pink',
  },
})

export default Topic
