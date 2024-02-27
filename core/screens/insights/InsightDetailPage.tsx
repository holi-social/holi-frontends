import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageStyle, Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useBreakpointMatcher } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import InsightDrawer from '@holi/core/screens/insights/components/InsightDrawer'
import { InsightByIdResponse, insightById } from '@holi/core/screens/insights/queries'
import { Recommendation } from '@holi/core/screens/insights/types'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliBadge from '@holi/ui/components/molecules/HoliBadge'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import RecommendationPreview from './components/RecommendationPreview'

export type InsightDetailPageParams = {
  insightId: string
}

const { useParam } = createParamHooks<InsightDetailPageParams>()

const InsightDetailPage = () => {
  const [insightId] = useParam('insightId')
  const { t, i18n } = useTranslation()
  const mixins = useStyleMixins()
  const { replaceRoute } = useRouting()
  const postGridItemsInRow = useBreakpointMatcher()
  const [showCuratorModal, setShowCuratorModal] = useState(false)

  const {
    data: { insightById: insight } = {},
    loading,
    refetch,
  } = useQuery<InsightByIdResponse>(insightById, {
    variables: { id: insightId },
    skip: !insightId,
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load insight', { location: 'InsightDetailPage.insightById', insightId })
    },
  })
  const setScreenOptions = useSetScreenOptions()

  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const posts: Post[] = insight?.posts || []
  const recommendations: Recommendation[] = insight?.recommendations || []
  const author = insight?.creator

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTransparent: true,
      headerTintColor: colors.white100,
      headerRight: () => {
        return (
          insight && (
            <InsightDrawer insight={insight}>
              <View>
                <HoliIcon icon={MoreFilled} color={colors.white100} />
              </View>
            </InsightDrawer>
          )
        )
      },
    })
  }, [insight, setScreenOptions])

  const recommendationsTitle =
    recommendations.length > 1
      ? t('insights.recommendations.title', { name: author?.firstName, number: recommendations.length })
      : t('insights.recommendations.title.single', { name: author?.firstName })

  return (
    <>
      <StatusBar style="light" animated />

      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        style={styles.wrapper}
        headerOverlap
      >
        {insight && !loading ? (
          <>
            <HoliImageBackground
              source={{ uri: insight.headerImage }}
              resizeMode="cover"
              style={[mixins.container, styles.bannerImage]}
              imageStyle={styles.insightImage as ImageStyle}
            />
            <View style={[styles.content, mixins.container]}>
              {!!insight.topic && (
                <View style={styles.tag}>
                  <HoliBadge>{insight.topic.title}</HoliBadge>
                </View>
              )}

              <View style={styles.tag}>
                <HoliHeading level="1" size="l" testID="insight-headline">
                  {insight.title}
                </HoliHeading>
              </View>

              {author && (
                <>
                  <View style={styles.curator}>
                    <HoliText style={styles.authorInfoText}>
                      <HoliText style={styles.date} color="gray300">
                        {getRelativeDateString(insight.datePublished, i18n.language)}
                      </HoliText>
                      {' · '}
                      <HoliText color="gray300">{t('insight.curatedBy')}</HoliText>
                    </HoliText>
                    <HoliButton
                      transparent
                      label={t('user.cards.modal.showInfo', { name: author.fullName })}
                      onPress={() => setShowCuratorModal(true)}
                    >
                      <View style={styles.authorInfoInner}>
                        <HoliAvatar
                          imageSrc={author.avatar}
                          imageBlurhash={author.avatarBlurhash}
                          label={author.fullName ?? ''}
                          initials={author.avatarLabel || ''}
                          defaultColor={author.avatarDefaultColor || ''}
                          style={styles.authorInfoAvatar}
                        />
                        <View>
                          <HoliText bold>{author.fullName}</HoliText>
                          <HoliText size="small">{t('global.independentJournalist')}</HoliText>
                        </View>
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
                      testID="insight-curator"
                    />
                  </HoliModal>
                </>
              )}

              <HoliRichTextOutput text={insight.description} allowAllLinks />
            </View>
          </>
        ) : (
          <Skeleton />
        )}

        {recommendations.length > 0 && (
          <View style={mixins.container}>
            <HoliGap size="l" />
            <View style={styles.sectionTitle}>
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_sparkle.svg')}
                width={37}
                height={37}
                label={recommendationsTitle}
                isSvg
              />
              <HoliHeading>{recommendationsTitle}</HoliHeading>
            </View>
            <HoliGap size="s" />
            <HoliGridWrapper itemsInRow={postGridItemsInRow}>
              {recommendations.map((recommendation) => (
                <HoliGridCell key={recommendation.id}>
                  <RecommendationPreview recommendation={recommendation} />
                </HoliGridCell>
              ))}
            </HoliGridWrapper>
          </View>
        )}

        {posts.length > 0 && (
          <View style={[mixins.container, styles.postList]}>
            <HoliGridWrapper itemsInRow={postGridItemsInRow}>
              {posts.map((post) => (
                <HoliGridCell key={post.id}>
                  <PostPreview post={post} insightId={insightId} />
                </HoliGridCell>
              ))}
            </HoliGridWrapper>
          </View>
        )}
      </ScrollHeaderLayout.Refreshable>
    </>
  )
}

// Trying out Skeleton as a separate component, why?
// i) Feels wrong that smaller atoms & molecules have to have 2 concerns eg show title or a skeleton. SRP FTW.
// ii) There's lots of branches in the code to deal with an insight possibly being null -
//      catch this early and we can rely on insight being present and the code is less complex
// Cons - There's duplication and possible drift between real UI and Skeleton... but Skeleton only has to
// be an approximation of the ui.

const Skeleton = () => {
  const mixins = useStyleMixins()

  return (
    <>
      <View style={[mixins.container, styles.bannerImage]}>
        <HoliSkeleton height="100%" width="100%" borderRadius={0} />
      </View>
      <View style={[styles.content, mixins.container]}>
        <View style={styles.tag}>
          <HoliSkeleton height={Spacing.lg} width="40%" borderRadius={24} />
        </View>
        <View style={styles.title}>
          <HoliSkeleton height={Spacing.xxl} width="100%" borderRadius={16} />
        </View>
        <View style={styles.curator}>
          <View style={styles.skeletonCurrator}>
            <HoliSkeleton height={Spacing['4xl']} width={Spacing['4xl']} borderRadius={64} />
            <HoliSkeleton height={Spacing.xxl} width={128} borderRadius={16} />
          </View>
        </View>
        <HoliSkeleton height={256} width="100%" borderRadius={16} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background20,
  },
  bannerImage: {
    paddingHorizontal: 0,
    height: Platform.OS === 'web' ? 680 : 340,
    ...Platform.select({
      web: {
        maxHeight: '50vh',
        objectFit: 'cover',
      },
      native: { maxHeight: '50%' },
    }),
  } as ImageStyle,
  insightImage: {
    ...Platform.select({ web: { height: '100%' } }),
  },
  content: {
    backgroundColor: colors.background10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  tag: {
    marginBottom: Spacing['3xs'],
  },
  title: {
    marginBottom: Spacing.xs,
  },
  curator: {
    marginBottom: Spacing.lg,
  },
  skeletonCurrator: {
    flexDirection: 'row',
    gap: Spacing['3xs'],
    alignItems: 'center',
  },
  authorInfoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray100,
    padding: 12,
  },
  authorInfoAvatar: {
    marginRight: 16,
  },
  authorInfoText: {
    marginBottom: Spacing['3xs'],
  },
  date: {
    textTransform: 'capitalize',
  },
  authorInfoName: {
    color: colors.foreground30,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
  postList: {
    marginTop: 24,
  },
})

export default withProfiler(memo(InsightDetailPage), { name: 'InsightDetailPage' })
