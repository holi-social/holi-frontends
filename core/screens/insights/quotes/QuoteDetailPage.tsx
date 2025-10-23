import { useQuery } from '@apollo/client/react'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ImageStyle, Platform, StyleSheet, View, type ViewStyle } from 'react-native'

import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import InsightReactions, { ItemType } from '@holi/core/screens/insights/InsightReactions'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import WebViewHandler from '@holi/core/screens/insights/components/WebViewHandler'
import { insightWithQuoteById, type InsightWithQuoteByIdResponse } from '@holi/core/screens/insights/queries'
import QuoteCard from '@holi/core/screens/insights/quotes/QuoteCard'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled, Share, ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'
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
import { useApolloNotFoundErrorHandling } from '@holi/core/hooks/useApolloNotFoundErrorHandling'

export type QuoteDetailPageParams = {
  insightId: string
  quoteId: string
}

const { useUUIDParam } = createParamHooks<QuoteDetailPageParams>()

const QuoteDetailPage = () => {
  const [insightId] = useUUIDParam('insightId')
  const [quoteId] = useUUIDParam('quoteId')

  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const [showWebView, setShowWebView] = useState(false)

  const {
    data: { insightById: insight } = {},
    loading,
    refetch,
    error,
  } = useQuery<InsightWithQuoteByIdResponse>(insightWithQuoteById, {
    variables: { insightId, quoteId },
    skip: !insightId || !quoteId,
    notifyOnNetworkStatusChange: true,
  })
  useApolloNotFoundErrorHandling(error, 'Failed to load quote', { location: 'QuoteDetailPage.quoteById', quoteId })

  const quote = insight?.quote

  useOnRefresh(refetch)

  const shareLink = useShareLink({
    link: `/insights/${insight?.id}/quotes/${quoteId}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('insights.quotes.share.message', {
      title: quote?.linkPreview.title ?? '',
      interpolation: { escapeValue: false },
    })}`,
  })

  useEffect(() => {
    if (showWebView) return

    setScreenOptions({
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {t('insights.quotes.title')}
        </Text>
      ),
      headerRight: () => {
        return (
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
        )
      },
      headerLeft: ({ tintColor }) => (
        <HeaderBackButton tintColor={tintColor} fallbackRoute={`/insights/${insightId}`} />
      ),
    })
  }, [showWebView, setScreenOptions, shareLink, t, colors.black300, insightId])

  if (showWebView && quote) {
    return (
      <WebViewHandler
        url={quote.link}
        visible={true}
        onClose={() => setShowWebView(false)}
        shareAction={shareLink}
        sourceType="quote"
        insightId={insightId}
      />
    )
  }

  return (
    <>
      <ScrollViewRefreshable contentContainerStyle={styles.wrapper} backgroundColor={theme.colors.background20}>
        {quote && !loading ? (
          <>
            {quote.linkPreview.image && (
              <HoliImageBackground
                source={{ uri: quote.linkPreview.image }}
                resizeMode="cover"
                style={[mixins.container, styles.bannerImage]}
                imageStyle={styles.quoteImage as ImageStyle}
              />
            )}

            <View style={[mixins.container, styles.section, styles.curvedBottom, styles.header]}>
              <LinkInfo icon={quote.linkPreview.icon} link={quote.link} />
              <HoliGap size="s" />
              <Text headingLevel="1" size="3xl" numberOfLines={3}>
                {quote.linkPreview.title}
              </Text>
            </View>

            <View style={[mixins.container, styles.section, styles.curvedTop, styles.curvedBottom]}>
              <View style={{ flexDirection: 'row', gap: Spacing.xxs }}>
                <Avatar
                  size="xs"
                  source={insight!.creator?.avatar || undefined}
                  imgPlaceholder={insight!.creator?.avatarBlurhash || undefined}
                  label={insight!.creator?.fullName ?? ''}
                  initials={insight!.creator?.avatarLabel}
                />

                <Text size="lg" headingLevel="3">
                  {t('insights.quotes.detail.subtitle')}
                </Text>
              </View>

              <HoliGap size="s" />
              <QuoteCard.QuoteOnly quote={quote} quoteColor="#A3DAFC" hideReactions />
              <HoliGap size="s" />
              <Text size="sm" margin={{ bottom: 'xs' }}>
                {quote.comment}
              </Text>
              <Stack direction="row" justifyContent="space-between">
                <ReactionCount count={quote.reactions.HEART} />
                <InsightReactions item={quote} itemType={ItemType.QUOTE} />
              </Stack>
            </View>
          </>
        ) : (
          <Skeleton />
        )}
      </ScrollViewRefreshable>

      <View style={[mixins.container, styles.openLinkButton]}>
        {(!quote || loading) && <HoliButtonLoading loading loadingLabel={t('global.loading')} label="" />}
        {quote && !loading && (
          <HoliButtonLoading
            icon={ShareBox}
            label={t('global.visitLinkButton.label')}
            onPress={() => setShowWebView(true)}
          />
        )}
      </View>
    </>
  )
}

const Skeleton = () => {
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <>
      <View style={[mixins.container, styles.bannerImage, styles.wrapper]}>
        <HoliSkeleton height={styles.bannerImage.height as number} width="100%" borderRadius={0} />
      </View>
      <View style={[mixins.container, styles.section]}>
        <HoliSkeleton height={16} width="100%" borderRadius={0} />
        <HoliGap size="s" />
        <HoliSkeleton height={32} width="100%" borderRadius={0} />
      </View>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      paddingBottom: 124,
    },
    header: {
      marginBottom: 2,
    },
    bannerImage: {
      paddingHorizontal: 0,
      aspectRatio: 375 / 202,
      ...Platform.select({
        web: {
          height: 680,
          maxHeight: '50vh',
          objectFit: 'cover',
        },
        native: { maxHeight: '50%', aspectRatio: 375 / 202 },
      }),
    } as ViewStyle,

    quoteImage: {
      ...Platform.select({ web: { height: '100%' } }),
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
    openLinkButton: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      maxWidth: dimensions.maxButtonWidth,
      left: 0,
      right: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      ...Platform.select({
        native: { position: 'absolute', bottom: 40 },
        web: { position: 'fixed', bottom: 82 },
      }),
    },
  })

export default memo(QuoteDetailPage)
