import { useQuery } from '@apollo/client'
import { faker } from '@faker-js/faker'
import type { Insight } from 'core/screens/homeFeed/types'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { LastInsightsResponse, lastInsightsQuery } from '@holi/core/screens/homeFeed/queries'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
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
  const { navigate } = useRouting()
  const numberOfItems = 2

  useNavigationHeader(navigation, {
    title: t('topics.topic.title', { title: topicId }),
    headerLeft: () => <BackButton icon="arrow-down-s" />,
  })

  const { loading, error, data } = useQuery<LastInsightsResponse>(lastInsightsQuery, {
    variables: { numberOfItems },
  })

  if (error) {
    console.log('######## Topic load error')
    logError(error, `[Topic.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  const insights: Insight[] = data?.lastInsights?.length ? data.lastInsights : fakeTopics

  // Important: `insights.find() should be called after useEffect() or useLayoutEffet()
  // A hard reload will cause an error.
  // see here: https://reactjs.org/docs/hooks-rules.html
  const topic = insights.find((insight) => insight.id == topicId)
  if (!topic) return <HoliText>{t('topics.topic.notFound', { topicId })}</HoliText>

  const author = {
    ...topic.curator,
    fullName: `${topic.curator.firstName} ${topic.curator.lastName}`.trim(),
    avatar: faker.image.avatar(), // TODO: dummy image
  }

  // TODO: dummy category
  const category = 'Immigration'

  // TODO: dummy image
  // const headerImage = topic.headerImage
  const headerImage = 'https://image.geo.de/30657478/t/5W/v6/w960/r1.5/-/wer-hat-den-foehn-picture-1238735191.jpg'

  return (
    <>
      <StatusBar style="light" animated />

      <DefaultLayout bounces={false} style={styles.wrapper}>
        {/* Image section */}
        <ImageBackground
          source={{ uri: headerImage }}
          resizeMode="cover"
          style={styles.topicBackgroundImage}
          imageStyle={styles.topicImage}
        />

        {/* Topic content */}
        <View style={[mixins.container, styles.topicView]}>
          <HoliHeading size="xSmall" style={styles.categoryHeadline} testID="topic-category">
            {category}
          </HoliHeading>

          <HoliHeading level="1" size="super" style={styles.topicHeadline} testID="topic-headline">
            {topic.title}
          </HoliHeading>

          <HoliText style={styles.topicText}>{topic.description}</HoliText>

          {/* Author  */}
          <View style={styles.authorInfo}>
            <HoliUserAvatar
              imageSrc={author.avatar}
              label={author.fullName}
              initials={author.avatarLabel || ''}
              defaultColor={author.avatarDefaultColor || ''}
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

        {/* List of posts */}
        {topic.posts.map((post) => (
          <HoliButton
            key={post.id}
            label={post.text}
            transparent
            style={styles.post}
            onPress={() => navigate(`/topics/${topicId}/posts/${post.id}`)}
          >
            <HoliText>{post.text}</HoliText>
          </HoliButton>
        ))}

        {/* <View style={[mixins.container, Platform.OS === 'web' && mixins.twoColumnGrid]}>
          {[...Object.getOwnPropertyNames(topic.posts)].map((postId) => (
            <View key={postId} style={styles.post}>
              <HoliText>{topic.posts[postId].text}</HoliText>
            </View>
          ))}
        </View> */}
      </DefaultLayout>

      {/* Header */}
      {Platform.OS !== 'web' && (
        <View style={styles.mobileHeader}>
          <LinearGradient colors={[colors.shadowColorBlack, 'transparent']} style={styles.headerBackgroundGradient} />
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
    </>
  )
}

const headerLeftWidth = 50
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundColorGreyDark,
  },
  mobileHeader: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    height: 100,
  },
  headerBackgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  headerInner: {
    flexDirection: 'row',
    width: '100%',
  },
  headerLeft: {
    width: headerLeftWidth,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerCenter: {
    flex: 1,
    marginRight: headerLeftWidth,
    justifyContent: 'center',
    alignItems: 'center',
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
