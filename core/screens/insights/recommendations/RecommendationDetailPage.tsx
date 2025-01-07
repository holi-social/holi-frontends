import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, type ImageStyle, Linking, Platform, StyleSheet, View } from 'react-native'

import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { type InsightWithRecommendationResponse, insightWithRecommendation } from '@holi/core/screens/insights/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled, Share, ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Avatar } from 'holi-bricks/components/avatar'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'

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
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

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

  useOnRefresh(refetch)

  const recommendation = insightById?.recommendation
  const creator = insightById?.creator

  const [, shareLink] = useShareLink({
    link: `/insights/${insightId}/recommendations/${recommendationId}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('insights.recommendations.share.message', {
      title: recommendation?.linkPreview.title ?? '',
      interpolation: { escapeValue: false },
    })}`,
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: ({ tintColor }) => (
        <HeaderTitle tintColor={tintColor}>{t('insights.recommendations.title')}</HeaderTitle>
      ),
      headerRight: () => {
        return (
          <HoliActionDrawer.Drawer
            label={t('global.moreOptions')}
            buttonElement={<HoliIcon icon={MoreFilled} color={colors.black300} />}
          >
            <HoliActionDrawer.Action
              icon={Share}
              title={t('global.share')}
              testID="btn-share-insight"
              handleAction={shareLink}
            />
          </HoliActionDrawer.Drawer>
        )
      },
    })
  }, [t, setScreenOptions, shareLink, colors.black300])

  return (
    <>
      <ScrollViewRefreshable style={styles.layout} contentContainerStyle={[mixins.container, styles.container]}>
        {recommendation && !loading ? (
          <View style={styles.content}>
            {recommendation.linkPreview.image && (
              <HoliImageBackground
                source={{ uri: recommendation.linkPreview.image }}
                resizeMode="cover"
                style={styles.bannerImage}
              />
            )}
            <View style={[mixins.container, styles.section, styles.curvedBottom, styles.header]}>
              <LinkInfo icon={recommendation.linkPreview.icon} link={recommendation.link} />
              <HoliGap size="s" />
              <HoliHeading level="1" size="l" numberOfLines={3}>
                {recommendation.linkPreview.title}
              </HoliHeading>
            </View>
            <View style={styles.comment}>
              {creator && (
                <View style={styles.recommender}>
                  <Avatar
                    size="xs"
                    imgSrc={creator.avatar}
                    imgPlaceholder={creator.avatarBlurhash}
                    label={creator.fullName ?? ''}
                    initials={creator.avatarLabel || ''}
                  />
                  <HoliText bold>{t('insights.recommendations.creator_reason')}</HoliText>
                </View>
              )}
              <HoliText>{recommendation.comment}</HoliText>
            </View>
          </View>
        ) : (
          <Skeleton />
        )}
      </ScrollViewRefreshable>

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

const Skeleton = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  return (
    <>
      <View style={[styles.bannerImage]}>
        <HoliSkeleton height="100%" width="100%" borderRadius={0} />
      </View>
      <View style={[styles.header, styles.curvedTop, styles.curvedBottom]}>
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
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layout: {
      ...Platform.select({
        web: {
          minHeight: '100vh' as DimensionValue,
        },
      }),
      backgroundColor: theme.colors.background20,
    },
    container: {
      paddingHorizontal: 0,
      paddingBottom: dimensions.bottomBarHeight + 100,
    },
    content: {
      backgroundColor: theme.colors.background20,
    },
    header: {
      marginBottom: 2,
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
    recommender: {
      flexDirection: 'row',
      gap: Spacing['3xs'],
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    comment: {
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xs,
    },
    footer: {
      width: '100%',
      padding: Spacing.xxs,
      position: 'absolute',
      bottom: Spacing.xs,
      ...Platform.select({
        web: { position: 'fixed', bottom: dimensions.bottomBarHeight + Spacing.xs },
      }),
    },
    linkButton: {
      maxWidth: dimensions.maxButtonWidth,
      marginHorizontal: 'auto',
    },
    section: {
      backgroundColor: theme.colors.background10,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.xs,
      paddingHorizontal: Spacing.xs,
    },
    curvedBottom: {
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },
    curvedTop: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
    },
  })

export default RecommendationDetailPage
