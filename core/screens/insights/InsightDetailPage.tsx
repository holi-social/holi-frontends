import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageStyle, Platform, Pressable, StyleSheet, View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import InsightDrawer from '@holi/core/screens/insights/components/InsightDrawer'
import DiscussionCard from '@holi/core/screens/insights/discussions/DiscussionCard'
import DiscussionsSection from '@holi/core/screens/insights/discussions/DiscussionsSection'
import InitiativesCarousel from '@holi/core/screens/insights/initiatives/InitiativesCarousel'
import { InsightByIdResponse, insightById } from '@holi/core/screens/insights/queries'
import QuotesCarousel from '@holi/core/screens/insights/quotes/QuotesCarousel'
import RecommendationsCarousel from '@holi/core/screens/insights/recommendations/RecommendationsCarousel'
import { Discussion, Initiative, Quote, Recommendation } from '@holi/core/screens/insights/types'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliBadge from '@holi/ui/components/molecules/HoliBadge'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightDetailPageParams = {
  insightId: string
}

const { useParam } = createParamHooks<InsightDetailPageParams>()

const InsightDetailPage = () => {
  const [insightId] = useParam('insightId')
  const { t, i18n } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate, replaceRoute } = useRouting()
  const [showCuratorModal, setShowCuratorModal] = useState(false)
  const { theme } = useTheme()
  const { colors } = theme
  const { width: screenWidth } = useClientWindowDimensions()
  const styles = useMemo(() => getStyles(theme, screenWidth), [theme, screenWidth])
  const carouselMarginHorizontal = screenWidth < dimensions.breakpointL ? Spacing.xs : 0

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

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTransparent: true,
      headerTintColor: colors.light,
      title: '',
      navigationCustomOptions: {
        headerBackgroundGradient: true,
      },
      headerRight: () => {
        return (
          insight && (
            <FeatureToggleGuard toggleName={FeatureToggleName.FAVORITES} featureNameKey="favorites" noLayout>
              <InsightDrawer insight={insight}>
                <HoliIcon icon={MoreFilled} color={colors.light} />
              </InsightDrawer>
            </FeatureToggleGuard>
          )
        )
      },
    })
  }, [insight, setScreenOptions, colors.light])

  const posts: Post[] = insight?.posts || []
  const recommendations: Recommendation[] = insight?.recommendations || []
  const quotes: Quote[] = insight?.quotes || []
  const initiatives: Initiative[] = insight?.initiatives || []
  const discussions: Discussion[] = insight?.discussions || []
  const creator = insight?.creator
  const initiativesTitle = t('insights.initiatives.title', { name: creator?.firstName })
  const cardWidth = 330
  const recommendationsTitle =
    recommendations.length > 1
      ? t('insights.recommendations.title.creator.multiple', {
          name: creator?.firstName,
          number: recommendations.length,
        })
      : t('insights.recommendations.title.creator.single', { name: creator?.firstName })

  const curatorInfo1 = [
    t('insights.curationPrinciples.principles.1'),
    t('insights.curationPrinciples.principles.2'),
    t('insights.curationPrinciples.principles.3'),
    t('insights.curationPrinciples.principles.4'),
  ]
  const curatorInfo2 = [t('insights.curationPrinciples.principles.5'), t('insights.curationPrinciples.principles.6')]

  const curatorSlides = [
    <View style={styles.slide} key={1}>
      <HoliText size="extralarge" style={styles.slideHeader}>
        {t('insights.curatorModal.header1')}
      </HoliText>
      <View style={styles.slideWrapper}>
        {creator && (
          <>
            <HoliAvatar
              imageSrc={creator.avatar}
              imageBlurhash={creator.avatarBlurhash}
              label={creator.fullName || t('user.profileView.anonymous')}
              initials={creator.avatarLabel}
              defaultColor={creator.avatarDefaultColor}
              size="extralarge"
            />
            <HoliText style={{ marginVertical: 8 }} size="large">
              {creator.fullName}
            </HoliText>
            <HoliButton
              variant="small"
              inline
              onPress={() => navigate(`/profile/${creator.id}`)}
              label={t('modal.close')}
              style={{ width: 120 }}
            >
              {t('insights.curatorModal.profileLink')}
            </HoliButton>
            <HoliText style={{ marginTop: 8 }} numberOfLines={8}>
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
              <HoliText>{index + 1}</HoliText>
            </View>
            <HoliText style={styles.copy}>{copy}</HoliText>
          </View>
        ))}
      </View>
    </View>,
  ]
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
            <View style={[styles.content, styles.section]}>
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
                      onPress={() => setShowCuratorModal(true)}
                      style={({ hovered }) => {
                        return hovered ? [styles.creatorInfoButtonHovered] : [styles.creatorInfoButton]
                      }}
                    >
                      <View style={styles.creatorInfo}>
                        <HoliAvatar
                          imageSrc={creator.avatar}
                          imageBlurhash={creator.avatarBlurhash}
                          label={creator.fullName ?? ''}
                          initials={creator.avatarLabel || ''}
                          defaultColor={creator.avatarDefaultColor || ''}
                          style={styles.creatorAvatar}
                        />
                        <View>
                          <HoliText bold>{creator.fullName}</HoliText>
                          <HoliText size="small">{t('global.journalist')}</HoliText>
                        </View>
                      </View>
                    </Pressable>
                  </View>

                  <HoliModal
                    label={t('user.cards.modal.showInfo', { name: creator.fullName })}
                    show={showCuratorModal}
                    onDismiss={() => setShowCuratorModal(false)}
                    style={{ backgroundColor: colors.background30 }}
                  >
                    <HoliCarousel
                      marginHorizontal={Spacing.md}
                      hideDotIndicators={false}
                      slides={curatorSlides.map((slide) => ({
                        children: slide,
                      }))}
                    />
                    <View>
                      <HoliButton
                        inline
                        style={styles.close}
                        onPress={() => setShowCuratorModal(false)}
                        label={t('modal.close')}
                      >
                        {t('insights.curatorModal.close')}
                      </HoliButton>
                    </View>
                  </HoliModal>
                </>
              )}

              <HoliRichTextOutput testID="insight-description" text={insight.description} allowAllLinks />
            </View>
            <HoliGap size="s" />
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

            {initiatives.length == 0 && (
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
                  <DiscussionCard key={d.id} discussion={d} />
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
      </ScrollHeaderLayout.Refreshable>
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
      <View style={[styles.bannerImage, styles.section]}>
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
    wrapper: {
      backgroundColor: theme.colors.background20,
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
      borderRadius: dimensions.spacingXs,
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
      borderRadius: dimensions.spacingXs,
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
    },
    creatorAvatar: {
      marginRight: Spacing.xxs,
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
      ...(screenWidth < dimensions.breakpointL && { paddingHorizontal: Spacing.xs }),
      maxWidth: '95%',
    },
    posts: {
      marginBottom: 36,
      ...(screenWidth < dimensions.breakpointL && { paddingHorizontal: Spacing.xs }),
    },
    postCard: {
      width: 304,
    },
    slide: {
      flex: 1,
    },
    slideWrapper: {
      height: '80%',
      backgroundColor: theme.colors.white100,
      padding: Spacing.md,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.black300,
      marginBottom: Spacing.md,
      overflow: 'hidden',
    },
    slideHeader: {
      marginBottom: Spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
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
    close: {
      marginHorizontal: 'auto',
      paddingHorizontal: 42,
      marginVertical: Spacing.md,
    },
  })

export default withProfiler(memo(InsightDetailPage), { name: 'InsightDetailPage' })
