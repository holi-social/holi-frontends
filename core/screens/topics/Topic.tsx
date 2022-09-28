import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import BackButton from '@holi/core/navigation/components/BackButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
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
  const author = {
    ...topic.author,
    fullName: `${topic.author.firstName} ${topic.author.lastName}`.trim(),
  }

  return (
    <>
      <StatusBar style="light" animated={true} />

      <DefaultLayout bounces={false} style={styles.wrapper}>
        {/* Image section */}
        <View>
          <ImageBackground
            source={{ uri: topic.image.src }}
            resizeMode="cover"
            style={styles.topicBackgroundImage}
            imageStyle={styles.topicImage}
          />

          {/* Header */}
          {Platform.OS !== 'web' && (
            <View style={styles.header}>
              <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.headerBackgroundGradient} />

              <SafeAreaView style={styles.headerInner}>
                <View style={styles.headerLeft}>
                  <BackButton tintColor={colors.fontColorWhite} icon="arrow-down-s" />
                </View>

                <View style={styles.headerCenter}>
                  <HeaderTitle style={styles.headerTitle} />
                </View>
              </SafeAreaView>
            </View>
          )}
        </View>

        {/* Topic content */}
        <View style={[mixins.container, styles.topicView]}>
          <HoliHeading size="xSmall" style={styles.categoryHeadline} testID="topic-category">
            {/* TODO: provide real data from BE */}
            Immigration
          </HoliHeading>

          <HoliHeading level="1" size="super" style={styles.topicHeadline} testID="topic-headline">
            {topic.title}
          </HoliHeading>

          <HoliText style={styles.topicText}>{topic.text}</HoliText>

          {/* Author  */}
          <View style={styles.authorInfo}>
            <HoliUserAvatar
              imageSrc={author.avatar}
              label={author.fullName}
              initials={author.avatarLabel}
              defaultColor={author.avatarDefaultColor}
              size="small"
              style={styles.authorInfoAvatar}
            />

            <HoliText size="small" style={styles.authorInfoText}>
              <Trans t={t} i18nKey="insight.curatedBy" values={{ name: author.fullName }}>
                <HoliText size="small">{author.fullName}</HoliText>
              </Trans>
            </HoliText>
          </View>
        </View>

        {/* Dummy list of posts */}
        <View style={[mixins.container, Platform.OS === 'web' && mixins.twoColumnGrid]}>
          {[...Object.getOwnPropertyNames(topic.posts)].map((postId) => (
            <View key={postId} style={styles.post}>
              <HoliText>{topic.posts[postId].text}</HoliText>
            </View>
          ))}
        </View>
      </DefaultLayout>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundColorGreyDark,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    position: 'absolute',
  },
  headerBackgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  headerLeft: {
    position: 'absolute',
    bottom: '50%',
    left: 0,
    transform: [{ translateY: 15 }],
  },
  headerCenter: {
    paddingVertical: 16,
  },
  headerTitle: {
    color: colors.fontColorWhite,
  },
  topicBackgroundImage: {
    height: Platform.OS === 'web' ? 680 : 340,
    ...Platform.select({
      web: {
        maxHeight: '50vh',
        objectFit: 'cover',
      },
      native: { maxHeight: '50%' },
    }),
  },
  topicImage: {
    ...Platform.select({ web: { height: 'auto' } }),
  },
  topicView: {
    backgroundColor: colors.backgroundColorWhite,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 40,
    paddingBottom: 24,
    marginBottom: 24,
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
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
  authorInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfoAvatar: {
    marginRight: 16,
  },
  authorInfoText: {
    color: colors.grey,
  },
  post: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundColorWhite,
    flex: 1,
    marginBottom: 16,
  },
})

export default Topic
