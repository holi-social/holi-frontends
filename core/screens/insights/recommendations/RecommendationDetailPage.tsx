import { useQuery } from '@apollo/client'
import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, View, type ViewStyle, StyleSheet } from 'react-native'

import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import WebViewHandler from '@holi/core/screens/insights/components/WebViewHandler'
import { type InsightWithRecommendationResponse, insightWithRecommendation } from '@holi/core/screens/insights/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled, Share, ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Avatar } from 'holi-bricks/components/avatar'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Stack } from 'holi-bricks/components/stack'
import ReactionCount from '@holi/core/components/reactions/ReactionCount'
import InsightReactions, { ItemType } from '@holi/core/screens/insights/InsightReactions'
import { Text } from 'holi-bricks/components/text'

export type RecommendationDetailPageParams = {
  insightId: string
  recommendationId: string
}

const { useUUIDParam } = createParamHooks<RecommendationDetailPageParams>()

const RecommendationDetailPage = () => {
  const [insightId] = useUUIDParam('insightId')
  const [recommendationId] = useUUIDParam('recommendationId')
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme
  const [showWebView, setShowWebView] = useState(false)

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

  useEffect(() => {
    if (showWebView) return

    setScreenOptions({
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: ({ tintColor }) => (
        <HeaderTitle tintColor={tintColor}>{t('insights.recommendations.title')}</HeaderTitle>
      ),
      headerRight: () => (
        <HoliActionDrawer.Drawer
          label={t('global.moreOptions')}
          buttonElement={<HoliIcon icon={MoreFilled} colorOverride={colors.black300} />}
        >
          <HoliActionDrawer.Action
            icon={Share}
            title={t('global.share')}
            testID="btn-share-insight"
            handleAction={shareLink}
          />
        </HoliActionDrawer.Drawer>
      ),
      headerLeft: ({ tintColor }) => (
        <HeaderBackButton tintColor={tintColor} fallbackRoute={`/insights/${insightId}`} />
      ),
    })
  }, [showWebView, setScreenOptions, t, colors.black300, insightId, shareLink])

  if (showWebView && recommendation) {
    return (
      <WebViewHandler
        url={recommendation.link}
        visible={true}
        onClose={() => setShowWebView(false)}
        shareAction={shareLink}
        sourceType="recommendation"
        insightId={insightId}
      />
    )
  }

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
              <Text headingLevel="1" size="3xl" numberOfLines={3}>
                {recommendation.linkPreview.title}
              </Text>
            </View>
            <View style={styles.comment}>
              {creator && (
                <View style={styles.recommender}>
                  <Avatar
                    size="xs"
                    source={creator.avatar}
                    imgPlaceholder={creator.avatarBlurhash}
                    label={creator.fullName ?? ''}
                    initials={creator.avatarLabel || ''}
                  />
                  <Text size="lg">{t('insights.recommendations.creator_reason')}</Text>
                </View>
              )}
              <Text size="sm" margin={{ bottom: 'xs' }}>
                {recommendation.comment}
              </Text>
              <Stack direction="row" justifyContent="space-between">
                <ReactionCount count={recommendation.reactions.HEART} />
                <InsightReactions item={recommendation} itemType={ItemType.RECOMMENDATION} />
              </Stack>
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
            onPress={() => setShowWebView(true)}
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
    } as ViewStyle,
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
