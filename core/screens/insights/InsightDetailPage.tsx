import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { StatusBar } from 'expo-status-bar'
import React, { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageStyle, Platform, StyleSheet, View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import InsightDrawer from '@holi/core/screens/insights/components/InsightDrawer'
import QuotesCarousel from '@holi/core/screens/insights/components/quotes/QuotesCarousel'
import RecommendationsCarousel from '@holi/core/screens/insights/components/recommendations/RecommendationsCarousel'
import { InsightByIdResponse, insightById } from '@holi/core/screens/insights/queries'
import { Quote, Recommendation } from '@holi/core/screens/insights/types'
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
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
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
  const { replaceRoute } = useRouting()
  const [showCuratorModal, setShowCuratorModal] = useState(false)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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
      headerTintColor: colors.white100,
      title: '',
      navigationCustomOptions: {
        headerBackgroundGradient: true,
      },
      headerRight: () => {
        return (
          insight && (
            <FeatureToggleGuard toggleName={FeatureToggleName.FAVORITES} featureNameKey="favorites" noLayout>
              <InsightDrawer insight={insight}>
                <HoliIcon icon={MoreFilled} color={colors.white100} />
              </InsightDrawer>
            </FeatureToggleGuard>
          )
        )
      },
    })
  }, [insight, setScreenOptions, colors.white100])

  const posts: Post[] = insight?.posts || []
  const recommendations: Recommendation[] = insight?.recommendations || []
  const quotes: Quote[] = insight?.quotes || []

  const creator = insight?.creator
  const recommendationsTitle =
    recommendations.length > 1
      ? t('insights.recommendations.title', { name: creator?.firstName, number: recommendations.length })
      : t('insights.recommendations.title.single', { name: creator?.firstName })

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
                    <HoliButton
                      transparent
                      label={t('user.cards.modal.showInfo', { name: creator.fullName })}
                      onPress={() => setShowCuratorModal(true)}
                      style={styles.creatorInfoButton}
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
                    </HoliButton>
                  </View>

                  <HoliModal
                    label={t('user.cards.modal.showInfo', { name: creator.fullName })}
                    show={showCuratorModal}
                    onDismiss={() => setShowCuratorModal(false)}
                  >
                    <HoliUserCardsModalContent
                      title={''}
                      users={[creator]}
                      onDismiss={() => setShowCuratorModal(false)}
                    />
                  </HoliModal>
                </>
              )}

              <HoliRichTextOutput text={insight.description} allowAllLinks />
            </View>
            <HoliGap size="s" />
          </>
        ) : (
          <Skeleton />
        )}

        {recommendations.length > 0 && (
          <InsightCarouselSection
            heading={recommendationsTitle}
            headingIcon={{
              asset: require('@holi/ui/assets/img/illustrations/illustration_sparkle.svg'),
              label: recommendationsTitle,
            }}
          >
            <RecommendationsCarousel recommendations={recommendations} />
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
            <QuotesCarousel insightId={insight?.id} quotes={quotes} />
          </InsightCarouselSection>
        )}

        {posts.length > 0 && (
          <View style={styles.section}>
            <HoliGridWrapper>
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

export const InsightCarouselSection: React.FC<{
  heading: string
  headingIcon: { asset: NodeRequire; label: string }
  children: React.ReactNode
}> = ({ heading, headingIcon, children }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.section}>
      <HoliGap size="m" />
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
      <HoliGap size="s" />
    </View>
  )
}

// Trying out Skeleton as a separate component, why?
// i) Feels wrong that smaller atoms & molecules have to have 2 concerns eg show title or a skeleton. SRP FTW.
// ii) There's lots of branches in the code to deal with an insight possibly being null -
//      catch this early and we can rely on insight being present and the code is less complex
// Cons - There's duplication and possible drift between real UI and Skeleton... but Skeleton only has to
// be an approximation of the ui.

const Skeleton = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  return (
    <>
      <View style={[styles.bannerImage, styles.section]}>
        <HoliSkeleton height="100%" width="100%" borderRadius={0} />
      </View>
      <View style={[styles.content, styles.section]}>
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
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    section: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
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
    },
    creatorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: dimensions.spacingXs,
      borderWidth: 1,
      borderBottomWidth: 3,
      borderColor: theme.colors.gray100,
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
      paddingHorizontal: Spacing.md,
    },
  })

export default withProfiler(memo(InsightDetailPage), { name: 'InsightDetailPage' })
