import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { StatusBar } from 'expo-status-bar'
import { ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'
import { memo, useMemo, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { type ImageStyle, Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native'

import { FavoritableType, type Discussion } from '@holi/api/graphql/graphql-codegen'
import HoliHead from '@holi/core/components/HoliHead'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { getLocale, getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import generateRecommendationTitle from '@holi/core/i18n/helpers/generateRecommendationTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import DiscussionCard from '@holi/core/screens/insights/discussions/DiscussionCard'
import DiscussionsSection from '@holi/core/screens/insights/discussions/DiscussionsSection'
import InitiativesCarousel from '@holi/core/screens/insights/initiatives/InitiativesCarousel'
import { type InsightByIdResponse, insightById } from '@holi/core/screens/insights/queries'
import QuotesCarousel from '@holi/core/screens/insights/quotes/QuotesCarousel'
import RecommendationsCarousel from '@holi/core/screens/insights/recommendations/RecommendationsCarousel'
import type { Initiative, Quote, Recommendation } from '@holi/core/screens/insights/types'
import PollComponent from '@holi/core/screens/polls/PollComponent'
import type { Poll } from '@holi/core/screens/polls/types'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import type { Post } from '@holi/core/screens/posts/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Share } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Avatar } from 'holi-bricks/components/avatar'
import { Button } from 'holi-bricks/components/button'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import { Stack } from 'holi-bricks/components/stack'
import { useShareLink } from '@holi/core/hooks/useShareLink'
import { LinkType } from '@holi/core/hooks/useShareLink'
import { FavoritingButton } from '@holi/core/components/FavoritingButton'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking/events'
import { breakpoints } from 'holi-bricks/foundations'
import { useApolloNotFoundErrorHandling } from '@holi/core/hooks/useApolloNotFoundErrorHandling'

export type InsightDetailPageParams = {
  insightId: string
}

const { useUUIDParam } = createParamHooks<InsightDetailPageParams>()

const InsightDetailPage = () => {
  const [insightId] = useUUIDParam('insightId')
  const { t, i18n } = useTranslation()
  const { displayError } = useErrorHandling()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const [curatorModalShown, setCuratorModalShown] = useState(false)
  const { theme } = useTheme()
  const { colors } = theme
  const { width: screenWidth } = useClientWindowDimensions()
  const styles = useMemo(() => getStyles(theme, screenWidth), [theme, screenWidth])
  const carouselMarginHorizontal = screenWidth < breakpoints.lg ? Spacing.xs : 0
  const { track } = useTracking()
  const hasTrackedScreenView = useRef(false)

  const {
    data: { insightById: insight } = {},
    loading,
    refetch,
    error,
  } = useQuery<InsightByIdResponse>(insightById, {
    variables: { id: insightId },
    skip: !insightId,
    notifyOnNetworkStatusChange: true,
  })
  const setScreenOptions = useSetScreenOptions()

  const [, shareLink] = useShareLink({
    link: `/insights/${insight?.id}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('insights.insight.share.message', {
      title: insight?.title,
      interpolation: { escapeValue: false },
    })}`,
  })

  useOnRefresh(refetch)

  useApolloNotFoundErrorHandling(error, 'Failed to load insight', {
    location: 'InsightDetailPage.insightById',
    insightId,
  })

  useEffect(() => {
    if (insight?.title && insightId && !hasTrackedScreenView.current) {
      hasTrackedScreenView.current = true
      track(TrackingEvent.InsightDetailPage.viewed(insightId, insight.title))
    }
  }, [insight?.title, insightId, track])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      ...Platform.select({
        native: {
          headerTintColor: colors.light,
          title: '',
          headerTransparent: true,
        },
      }),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} shadow="dark" />,
      headerRight: ({ tintColor }) => {
        return (
          insight && (
            <Stack direction="row" gap="md">
              <HoliTransition.FadeRight visible index={0}>
                <FavoritingButton
                  favoritableId={insight.id}
                  favoritableType={FavoritableType.Insight}
                  __typename={insight.__typename}
                  tintColor={tintColor}
                  isFavorite={insight.isFavorite ?? false}
                  shadow="dark"
                  onError={(error) =>
                    displayError(
                      error,
                      insight.isFavorite
                        ? 'Failed to add the insight from favorites'
                        : 'Failed to remove the insight from favorites',
                      {
                        location: 'InsightDetailPage.favoriteInsight',
                        favoritableId: insight.id,
                      }
                    )
                  }
                />
              </HoliTransition.FadeRight>

              <HoliTransition.FadeRight visible index={1}>
                <Pressable onPress={shareLink}>
                  <HoliIcon icon={Share} colorOverride={tintColor} shadow="dark" />
                </Pressable>
              </HoliTransition.FadeRight>
            </Stack>
          )
        )
      },
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [insight, setScreenOptions, colors.light, colors.dark, shareLink, displayError, t])

  const posts: Post[] = insight?.posts || []
  const polls: Poll[] = insight?.polls || []
  const discussions: Discussion[] = insight?.discussions || []
  const recommendations: Recommendation[] = insight?.recommendations || []
  const quotes: Quote[] = insight?.quotes || []
  const initiatives: Initiative[] = insight?.initiatives || []
  const creator = insight?.creator
  const initiativesTitle = t('insights.initiatives.title', {
    name: creator?.firstName,
  })
  const cardWidth = 330
  const currentLanguage = getLocale(i18n.language || '')

  const recommendationsTitle = generateRecommendationTitle({
    name: creator?.firstName || '',
    numRecommendations: recommendations.length,
    currentLanguage,
    t,
  })

  const curatorInfo1 = [
    t('insights.curationPrinciples.principles.1'),
    t('insights.curationPrinciples.principles.2'),
    t('insights.curationPrinciples.principles.3'),
  ]
  const curatorInfo2 = [
    t('insights.curationPrinciples.principles.4'),
    t('insights.curationPrinciples.principles.5'),
    t('insights.curationPrinciples.principles.6'),
  ]

  const curatorSlides = [
    <View style={styles.slide} key={1}>
      <HoliText size="extralarge" style={styles.slideHeader} testID="insight-editors-heading">
        {t('insights.curatorModal.header1')}
      </HoliText>
      <View style={styles.slideWrapper}>
        {creator && (
          <>
            <Avatar
              source={creator.avatar}
              imgPlaceholder={creator.avatarBlurhash}
              label={creator.fullName || t('user.profileView.anonymous')}
              initials={creator.avatarLabel}
              size="lg"
            />
            <HoliText style={{ marginTop: 8 }} size="large">
              {creator.fullName}
            </HoliText>
            <HoliText size="small" style={styles.subline}>
              {t('insights.curatorModal.subline')}
            </HoliText>
            <View style={{ width: 120 }}>
              <Button
                size="sm"
                inline
                onPress={() => navigate(`/profile/${creator.id}`)}
                label={t('insights.curatorModal.profileLink')}
              />
            </View>
            <HoliText style={{ marginTop: 8 }} numberOfLines={4} ellipsizeMode="tail">
              {creator.aboutMe}
            </HoliText>
          </>
        )}
      </View>
    </View>,
    <View style={styles.slide} key={2}>
      <HoliText size="extralarge" style={styles.slideHeader}>
        {t('insights.curatorModal.header2')}
      </HoliText>
      <View style={styles.slideWrapper}>
        {curatorInfo1.map((copy, index) => (
          <View style={styles.row} key={index}>
            <View style={styles.count}>
              <HoliText>{index + 1}</HoliText>
            </View>
            <HoliText style={styles.copy}>{copy}</HoliText>
          </View>
        ))}
      </View>
    </View>,
    <View style={styles.slide} key={3}>
      <HoliText size="extralarge" style={styles.slideHeader}>
        {t('insights.curatorModal.header3')}
      </HoliText>
      <View style={styles.slideWrapper}>
        {curatorInfo2.map((copy, index) => (
          <View style={styles.row} key={index}>
            <View style={styles.count}>
              {/* For consecutive counting, 4 is the starting index in the second array */}
              <HoliText>{index + 4}</HoliText>
            </View>
            <HoliText style={styles.copy}>{copy}</HoliText>
          </View>
        ))}
      </View>
    </View>,
  ]
  return (
    <>
      <HoliHead
        title={insight?.title}
        description={insight?.description}
        ogTitle={insight?.title}
        ogDescription={insight?.description}
        ogImage={insight?.headerImage}
      />
      <StatusBar style="light" animated />

      <ScrollViewRefreshable style={styles.wrapper} contentContainerStyle={styles.contentContainer}>
        {insight && !loading ? (
          <>
            <HoliImageBackground
              source={{ uri: insight.headerImage }}
              resizeMode="cover"
              style={[mixins.container, styles.bannerImage]}
              imageStyle={styles.insightImage as ImageStyle}
            />
            <View style={[styles.content, styles.section]}>
              {!!insight.topicV2 && (
                <View style={styles.tag}>
                  <ChipLabel color="green">{t(`topic.${insight.topicV2}`)}</ChipLabel>
                </View>
              )}

              <View style={styles.tag}>
                <HoliHeading level="1" size="l" testID="insight-headline">
                  {insight.title}
                </HoliHeading>
              </View>

              {creator && (
                <>
                  <View style={styles.curator}>
                    <HoliText style={styles.creationDetails}>
                      <HoliText style={styles.date} color="gray300">
                        {getRelativeDateString(insight.datePublished, i18n.language)}
                      </HoliText>
                      {' · '}
                      <HoliText color="gray300">{t('insight.curatedBy')}</HoliText>
                    </HoliText>
                    <Pressable
                      onPress={() => setCuratorModalShown(true)}
                      style={({ hovered }) => {
                        return hovered ? [styles.creatorInfoButtonHovered] : [styles.creatorInfoButton]
                      }}
                      testID="btn-to-insight-curator-modal"
                    >
                      <View style={styles.creatorInfo}>
                        <Avatar
                          source={creator.avatar}
                          label={creator.fullName ?? ''}
                          initials={creator.avatarLabel || ''}
                        />
                        <View>
                          <HoliText bold>{creator.fullName}</HoliText>
                          <HoliText size="small">{t('global.journalist')}</HoliText>
                        </View>
                      </View>
                    </Pressable>
                  </View>

                  <HoliModal
                    label={t('user.cards.modal.showInfo', {
                      name: creator.fullName,
                    })}
                    shown={curatorModalShown}
                    onDismiss={() => setCuratorModalShown(false)}
                    style={{ backgroundColor: colors.background30 }}
                    testID="insight-editors-modal"
                  >
                    <HoliCarousel
                      marginHorizontal={Spacing.md}
                      style={{ marginHorizontal: 'auto' }}
                      slides={curatorSlides.map((slide) => ({
                        children: slide,
                      }))}
                    />
                    <View style={styles.close}>
                      <Button
                        inline
                        onPress={() => setCuratorModalShown(false)}
                        label={t('insights.curatorModal.close')}
                        testID="insight-editors-close-btn"
                      />
                    </View>
                  </HoliModal>
                </>
              )}

              <HoliRichTextOutput testID="insight-description" text={insight.description} allowAllLinks />
            </View>
            <HoliGap size="s" />
            {polls.length > 0 &&
              polls.map((poll) => (
                <View key={poll.id} style={styles.section}>
                  <PollComponent poll={poll} />
                </View>
              ))}
            {recommendations.length > 0 && (
              <InsightCarouselSection
                heading={recommendationsTitle}
                headingIcon={{
                  asset: require('@holi/ui/assets/img/illustrations/illustration_sparkle.svg'),
                  label: recommendationsTitle,
                }}
              >
                <RecommendationsCarousel
                  insight={insight}
                  recommendations={recommendations}
                  marginHorizontal={carouselMarginHorizontal}
                  slideWidth={cardWidth}
                />
              </InsightCarouselSection>
            )}

            {quotes.length > 0 && (
              <InsightCarouselSection
                heading={t('insights.quotes.title')}
                headingIcon={{
                  asset: require('@holi/ui/assets/img/illustrations/illustration_people.svg'),
                  label: 'Quote',
                }}
              >
                <QuotesCarousel
                  insightId={insight.id}
                  quotes={quotes}
                  marginHorizontal={carouselMarginHorizontal}
                  slideWidth={cardWidth}
                />
              </InsightCarouselSection>
            )}

            {initiatives.length > 0 && (
              <InsightCarouselSection
                heading={initiativesTitle}
                headingIcon={{
                  asset: require('@holi/ui/assets/img/illustrations/illustration_insight_initiatives.svg'),
                  label: initiativesTitle,
                }}
              >
                <InitiativesCarousel
                  insightId={insight.id}
                  initiatives={initiatives}
                  marginHorizontal={carouselMarginHorizontal}
                  slideWidth={cardWidth}
                />
              </InsightCarouselSection>
            )}

            {discussions.length > 0 && (
              <DiscussionsSection>
                {discussions.map((d) => (
                  <DiscussionCard key={d.id} insightId={insight.id} discussion={d} />
                ))}
              </DiscussionsSection>
            )}

            {posts.length > 0 && (
              <View style={[styles.section, styles.posts]}>
                <HoliGridWrapper>
                  {posts.map((post) => (
                    <HoliGridCell key={post.id}>
                      <PostPreview post={post} insightId={insightId} />
                    </HoliGridCell>
                  ))}
                </HoliGridWrapper>
              </View>
            )}
          </>
        ) : (
          <Skeleton />
        )}
      </ScrollViewRefreshable>
    </>
  )
}

const InsightCarouselSection: React.FC<{
  heading: string
  headingIcon: { asset: NodeRequire; label: string }
  children: React.ReactNode
}> = ({ heading, headingIcon, children }) => {
  const { theme } = useTheme()
  const { width: screenWidth } = useClientWindowDimensions()
  const styles = useMemo(() => getStyles(theme, screenWidth), [theme, screenWidth])

  return (
    <View style={styles.section}>
      <View style={[styles.sectionTitle]}>
        <HoliLocalImage
          imageSource={headingIcon.asset as StaticImageData}
          label={headingIcon.label}
          width={37}
          height={37}
          isSvg
        />
        <HoliHeading>{heading}</HoliHeading>
      </View>
      <HoliGap size="s" />
      {children}
    </View>
  )
}

const Skeleton = () => {
  const { theme } = useTheme()
  const { width: screenWidth } = useClientWindowDimensions()

  const styles = useMemo(() => getStyles(theme, screenWidth), [theme, screenWidth])
  return (
    <>
      <View style={[styles.bannerImage, styles.section, styles.imageSection]}>
        <HoliSkeleton height="100%" width="100%" borderRadius={0} />
      </View>
      <View style={[styles.content, styles.section]}>
        <View style={styles.tag}>
          <HoliSkeleton height={Spacing.lg} width="40%" borderRadius={24} />
        </View>
        <View style={styles.section}>
          <View style={styles.tag}>
            <HoliSkeleton height={Spacing.lg} width="40%" borderRadius={24} />
          </View>
          <View style={styles.title}>
            <HoliSkeleton height={Spacing.xxl} width="100%" borderRadius={16} />
          </View>
          <View style={styles.curator}>
            <View style={styles.skeletonCurator}>
              <HoliSkeleton height={Spacing['4xl']} width={Spacing['4xl']} borderRadius={64} />
              <HoliSkeleton height={Spacing.xxl} width={128} borderRadius={16} />
            </View>
          </View>
          <HoliSkeleton height={256} width="100%" borderRadius={16} />
        </View>
      </View>
    </>
  )
}

const getStyles = (theme: HoliTheme, screenWidth: number) =>
  StyleSheet.create({
    section: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
      marginBottom: Spacing.xl,
    },
    imageSection: {
      marginBottom: 0,
    },
    wrapper: {
      backgroundColor: theme.colors.background20,
    },
    contentContainer: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: breakpoints.lg - 128,
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
    } as ViewStyle,
    insightImage: {
      ...Platform.select({ web: { height: '100%' } }),
    },
    content: {
      backgroundColor: theme.colors.background10,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.lg,
      paddingHorizontal: Spacing.md,
    },
    tag: {
      marginBottom: Spacing['xs'],
    },
    title: {
      marginBottom: Spacing.xs,
    },
    curator: {
      marginBottom: Spacing.md,
    },
    skeletonCurator: {
      flexDirection: 'row',
      gap: Spacing['3xs'],
      alignItems: 'center',
    },
    creatorInfoButton: {
      maxWidth: dimensions.maxButtonWidth,
      borderRadius: Spacing['3xs'],
      borderWidth: 1,
      borderColor: theme.colors.gray100,
      shadowColor: theme.colors.gray100,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    creatorInfoButtonHovered: {
      maxWidth: dimensions.maxButtonWidth,
      borderRadius: Spacing['3xs'],
      borderWidth: 1,
      borderColor: theme.colors.black300,
      shadowColor: theme.colors.black300,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
    },
    creatorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.xxs,
      gap: Spacing.xxs,
    },
    creationDetails: {
      marginBottom: Spacing['3xs'],
    },
    date: {
      textTransform: 'capitalize',
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['3xs'],
      ...(screenWidth < breakpoints.lg && {
        paddingHorizontal: Spacing.xs,
      }),
      maxWidth: '95%',
    },
    posts: {
      marginBottom: 20,
      ...(screenWidth < breakpoints.lg && {
        paddingHorizontal: Spacing.xs,
      }),
    },
    postCard: {
      width: 304,
    },
    slide: {
      flex: 1,
    },
    slideWrapper: {
      backgroundColor: theme.colors.white100,
      padding: Spacing.md,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.black300,
      flexGrow: 1,
      ...Platform.select({
        web: {
          marginBottom: Spacing.md,
        },
      }),
    },
    slideHeader: {
      ...Platform.select({
        web: {
          marginBottom: Spacing.sm,
        },
        native: {
          marginBottom: 4,
        },
      }),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.xs,
      padding: Spacing['3xs'],
    },
    count: {
      borderRadius: 100,
      backgroundColor: theme.colors.brandB200,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.black300,
    },
    copy: {
      flexWrap: 'wrap',
      flex: 1,
    },
    subline: {
      color: theme.colors.foreground20,
      marginTop: 4,
      marginBottom: 8,
    },
    close: {
      marginHorizontal: 'auto',
      marginVertical: Spacing.md,
      ...Platform.select({
        web: {
          width: 327,
        },
        native: {
          marginHorizontal: Spacing.md,
        },
      }),
    },
  })

export default withProfiler(memo(InsightDetailPage), {
  name: 'InsightDetailPage',
})
