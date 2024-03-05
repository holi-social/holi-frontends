import { useQuery } from '@apollo/client'
import React from 'react'
import { DimensionValue, ImageStyle, Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { RecommendationByIdResponse, recommendationById } from '@holi/core/screens/insights/queries'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import RecommendedLink from './RecommendedLink'

export type RecommendationDetailPageParams = {
  recommendationId: string
}

const { useParam } = createParamHooks<RecommendationDetailPageParams>()

const RecommendationDetailPage = () => {
  const [recommendationId] = useParam('recommendationId')
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()

  const { data: { recommendationById: recommendation } = {}, refetch } = useQuery<RecommendationByIdResponse>(
    recommendationById,
    {
      variables: { id: recommendationId },
      notifyOnNetworkStatusChange: true,
      skip: !recommendationId,
      onError: (error) => {
        if (isNotFoundError(error)) {
          return replaceRoute('/404')
        }
        logError(error, 'Failed to load recommendation', {
          location: 'RecommendationDetailPage.recommendationById',
          recommendationId,
        })
      },
    }
  )

  const { refreshing, onRefresh } = useOnRefresh(refetch)

  //  TODO: use translated string
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: 'Top Recommendation',
    })
  }, [setScreenOptions])

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        style={styles.layout}
        contentStyle={mixins.container}
        headerOverlap
      >
        {recommendation && (
          <>
            <HoliImageBackground
              source={{ uri: recommendation.linkPreview.image }}
              resizeMode="cover"
              style={styles.bannerImage}
            />
            <View style={styles.link}>
              <RecommendedLink icon={recommendation.linkPreview.icon} link={recommendation.link} />
              <HoliGap size="s" />
              <HoliHeading level="1" size="l" numberOfLines={3}>
                {recommendation.linkPreview.title}
              </HoliHeading>
            </View>
            <View style={styles.comment}>
              {recommendation.insight && (
                <View style={styles.recommender}>
                  <HoliAvatar
                    size="micro"
                    imageSrc={recommendation.insight.creator.avatar}
                    imageBlurhash={recommendation.insight.creator.avatarBlurhash}
                    label={recommendation.insight.creator.fullName ?? ''}
                    initials={recommendation.insight.creator.avatarLabel || ''}
                    defaultColor={recommendation.insight.creator.avatarDefaultColor || ''}
                  />
                  <HoliText bold>{'Why I recommend this'}</HoliText>
                </View>
              )}
              <HoliText>{recommendation.comment}</HoliText>
            </View>
          </>
        )}
      </ScrollHeaderLayout.Refreshable>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
  },
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
  bannerImage: {
    paddingHorizontal: 0,
    width: '100%',
    height: 200,
    ...Platform.select({
      web: {
        maxHeight: '50vh',
      },
      native: { maxHeight: '50%' },
    }),
  } as ImageStyle,
  link: {
    backgroundColor: colors.background10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    borderRadius: 32,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
})

export default RecommendationDetailPage
