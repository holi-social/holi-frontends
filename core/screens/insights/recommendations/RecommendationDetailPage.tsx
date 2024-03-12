import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, ImageStyle, Linking, Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { InsightWithRecommendationResponse, insightWithRecommendation } from '@holi/core/screens/insights/queries'
import { ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type RecommendationDetailPageParams = {
  insightId: string
  recommendationId: string
}

const { useParam } = createParamHooks<RecommendationDetailPageParams>()

const RecommendationDetailPage = () => {
  const [insightId] = useParam('insightId')
  const [recommendationId] = useParam('recommendationId')
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  const {
    data: { insightById } = {},
    refetch,
    loading,
  } = useQuery<InsightWithRecommendationResponse>(insightWithRecommendation, {
    variables: { insightId, recommendationId },
    notifyOnNetworkStatusChange: true,
    skip: !insightId || !recommendationId,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load recommendation', {
        location: 'RecommendationDetailPage.insightWithRecommendation',
        recommendationId,
      })
    },
  })

  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const recommendation = insightById?.recommendation
  const creator = insightById?.creator

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('insights.recommendations.title'),
    })
  }, [t, setScreenOptions])

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        style={styles.layout}
        contentStyle={[mixins.container, styles.container]}
        headerOverlap
      >
        {recommendation && !loading ? (
          <>
            <HoliImageBackground
              source={{ uri: recommendation.linkPreview.image }}
              resizeMode="cover"
              style={styles.bannerImage}
            />
            <View style={styles.link}>
              <LinkInfo icon={recommendation.linkPreview.icon} link={recommendation.link} />
              <HoliGap size="s" />
              <HoliHeading level="1" size="l" numberOfLines={3}>
                {recommendation.linkPreview.title}
              </HoliHeading>
            </View>
            <View style={styles.comment}>
              {creator && (
                <View style={styles.recommender}>
                  <HoliAvatar
                    size="micro"
                    imageSrc={creator.avatar}
                    imageBlurhash={creator.avatarBlurhash}
                    label={creator.fullName ?? ''}
                    initials={creator.avatarLabel || ''}
                    defaultColor={creator.avatarDefaultColor || ''}
                  />
                  <HoliText bold>{t('insights.recommendations.creator_reason')}</HoliText>
                </View>
              )}
              <HoliText>{recommendation.comment}</HoliText>
            </View>
          </>
        ) : (
          <Skeleton />
        )}
      </ScrollHeaderLayout.Refreshable>
      {recommendation && !loading && (
        <View style={styles.footer}>
          <HoliButtonLoading
            style={styles.linkButton}
            role="link"
            label={t('insights.recommendations.open_link')}
            icon={ShareBox}
            onPress={() => Linking.openURL(recommendation?.link || '')}
          />
        </View>
      )}
    </>
  )
}

const Skeleton = () => (
  <>
    <View style={[styles.bannerImage]}>
      <HoliSkeleton height="100%" width="100%" borderRadius={0} />
    </View>
    <View style={styles.link}>
      <HoliSkeleton height={Spacing.md} width="40%" borderRadius={Spacing['3xs']} />
      <HoliGap size="s" />
      <HoliSkeleton height={Spacing.lg} width="60%" borderRadius={Spacing['3xs']} />
    </View>
    <View style={styles.comment}>
      <View style={styles.recommender}>
        <HoliSkeleton height={Spacing.md} width={Spacing.md} borderRadius={64} />
        <HoliSkeleton height={Spacing.md} width={'60%'} borderRadius={Spacing['3xs']} />
      </View>
      <HoliSkeleton height={260} width={'100%'} borderRadius={Spacing['3xs']} />
    </View>
  </>
)

const styles = StyleSheet.create({
  layout: {
    minHeight: '100%',
    paddingTop: dimensions.topBarHeight,
    backgroundColor: colors.background20,
    ...Platform.select({
      web: {
        minHeight: '100vh' as DimensionValue,
      },
    }),
  },
  container: {
    paddingBottom: dimensions.bottomBarHeight + 100,
  },
  bannerImage: {
    paddingHorizontal: 0,
    width: '100%',
    ...Platform.select({
      web: {
        height: 380,
        maxHeight: '50vh',
      },
      native: {
        height: 200,
        maxHeight: '50%',
      },
    }),
  } as ImageStyle,
  link: {
    backgroundColor: colors.background10,
    borderBottomLeftRadius: Spacing.lg,
    borderBottomRightRadius: Spacing.lg,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.md,
    marginBottom: 2,
  },
  recommender: {
    flexDirection: 'row',
    gap: Spacing['3xs'],
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  comment: {
    backgroundColor: colors.background10,
    borderRadius: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  footer: {
    width: '100%',
    position: 'fixed',
    bottom: dimensions.bottomBarHeight + 16,
    padding: Spacing.xxs,
  },
  linkButton: {
    maxWidth: dimensions.maxButtonWidth,
    marginHorizontal: 'auto',
  },
})

export default RecommendationDetailPage
