import { useQuery } from '@apollo/client'
import { faker } from '@faker-js/faker'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useLayoutEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ImageBackground, Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { NativeStackNavigationCustomHeaderOptions } from '@holi//mobile/navigation/HeaderAnimated'
import DefaultLayout from '@holi/core/DefaultLayout'
import { logError } from '@holi/core/errors/helpers'
import { useBreakpointMatcher, userFullName } from '@holi/core/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { fakePosts } from '@holi/core/screens/insights/fakeInsights'
import { InsightByIdResponse, insightById } from '@holi/core/screens/insights/queries'
import PostPreview from '@holi/core/screens/posts/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import { User } from '@holi/core/screens/userprofile/types'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightDetailPageParams = {
  insightId: string
}

const { useParam } = createParam<InsightDetailPageParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const InsightDetailPage: React.VFC<ScreenProps> = () => {
  const [insightId = ''] = useParam('insightId')
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const postGridItemsInRow = useBreakpointMatcher()
  const { navigate } = useRouting()
  const [showCuratorModal, setShowCuratorModal] = useState(false)
  const onScreenScroll = useScrollYHandler()
  const { setOptions } = useUnifiedNavigation()
  const { loading, error, data } = useQuery<InsightByIdResponse>(insightById, {
    variables: { id: insightId },
  })

  const insight = data?.insightById

  useLayoutEffect(
    () =>
      setOptions({
        title: t('insights.insight.title', { title: insight?.title }),
        headerTransparent: true,
        headerTintColor: colors.fontColorWhite,
        headerCustomOptions: {
          headerBackgroundGradient: true,
        },
      } as NativeStackNavigationCustomHeaderOptions),
    [setOptions, t, insight?.title]
  )

  if (error) {
    console.log('######## InsightDetailPage load error')
    logError(error, `[InsightDetailPage.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  // Important: `insights.find() should be called after useEffect() or useLayoutEffet()
  // A hard reload will cause an error.
  // see here: https://reactjs.org/docs/hooks-rules.html
  if (!insight) return <HoliText>{t('insights.insight.notFound', { insightId })}</HoliText>

  // if there are no posts in the insight from the okuna backend, use fake posts.
  // This way feature branches still have content and don't look empty.
  const posts: Post[] = insight.posts?.length ? insight.posts : fakePosts

  const author = {
    ...insight.curator,
    fullName: userFullName(insight.curator),
    avatar: faker.image.avatar(), // TODO: remove, use real avatar instead of dummy image
  }

  // TODO: dummy category
  const category = 'Immigration'

  // TODO: dummy image
  const headerImage = 'https://image.geo.de/30657478/t/5W/v6/w960/r1.5/-/wer-hat-den-foehn-picture-1238735191.jpg'

  return (
    <>
      <StatusBar style="light" animated />

      <DefaultLayout
        bounces={false}
        style={styles.wrapper}
        headerOverlap
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
      >
        {/* Image section */}
        <ImageBackground
          source={{ uri: headerImage }}
          resizeMode="cover"
          style={styles.insightBackgroundImage}
          imageStyle={styles.insightImage}
        />

        {/* Insight content */}
        <View style={[mixins.container, styles.insightView]}>
          <HoliHeading size="xSmall" style={styles.categoryHeadline} testID="insight-category">
            {category}
          </HoliHeading>

          <HoliHeading level="1" size="super" style={styles.insightHeadline} testID="insight-headline">
            {insight.title}
          </HoliHeading>

          <HoliText style={styles.insightText}>{insight.description}</HoliText>

          {/* Author  */}
          <View style={styles.authorInfo}>
            <HoliButton
              transparent
              label={t('user.cards.modal.showInfo', { name: author.fullName })}
              onPress={() => setShowCuratorModal(true)}
            >
              <View style={styles.authorInfoInner}>
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
                    <HoliText size="small" />
                  </Trans>
                </HoliText>
              </View>
            </HoliButton>
          </View>

          <HoliModal
            label={t('user.cards.modal.showInfo', { name: author.fullName })}
            show={showCuratorModal}
            onDismiss={() => setShowCuratorModal(false)}
            testID="insight-curator-modal"
          >
            <HoliUserCardsModalContent
              title={''} // don't show any headline in modal
              users={[author as User]}
              onDismiss={() => setShowCuratorModal(false)}
              onUserPress={({ id }) => {
                setShowCuratorModal(false)
                navigate('/profile/' + id)
              }}
              testID="insight-curator"
            />
          </HoliModal>
        </View>

        {/* Dummy list of posts */}
        {!!posts.length && (
          <View style={[mixins.container, styles.postList]}>
            <HoliGridWrapper itemsInRow={postGridItemsInRow}>
              {posts.map((post) => (
                <HoliGridCell key={post.id}>
                  <PostPreview insightId={insightId} post={post} />
                </HoliGridCell>
              ))}
            </HoliGridWrapper>
          </View>
        )}
      </DefaultLayout>
    </>
  )
}

const headerLeftWidth = 50
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundColorGreyDark,
    ...Platform.select({ web: { flex: 1 } }),
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
  insightBackgroundImage: {
    height: Platform.OS === 'web' ? 680 : 340,
    ...Platform.select({
      web: {
        maxHeight: '50vh',
        objectFit: 'cover',
      },
      native: { maxHeight: '50%' },
    }),
  },
  insightImage: {
    ...Platform.select({ web: { height: 'auto' } }),
  },
  insightView: {
    backgroundColor: colors.backgroundColorWhite,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 40,
    paddingBottom: 24,
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
  },
  categoryHeadline: {
    color: colors.fontColorHighlighted,
  },
  insightHeadline: {
    marginTop: 8,
  },
  insightText: {
    color: colors.grey,
    marginTop: 24,
  },
  authorInfo: {
    marginTop: 24,
  },
  authorInfoInner: {
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
  authorInfoName: {
    color: colors.fontColorBlack,
  },
  postList: {
    marginTop: 24,
  },
})

export default memo(InsightDetailPage)
