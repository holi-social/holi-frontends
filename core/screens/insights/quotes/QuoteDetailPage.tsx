import { useQuery } from '@apollo/client'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ImageStyle, Linking, Platform, StyleSheet, View } from 'react-native'

import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import InsightReactions, { ItemType } from '@holi/core/screens/insights/InsightReactions'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { type InsightWithQuoteByIdResponse, insightWithQuoteById } from '@holi/core/screens/insights/queries'
import QuoteCard from '@holi/core/screens/insights/quotes/QuoteCard'
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

export type QuoteDetailPageParams = {
  insightId: string
  quoteId: string
}

const { useUUIDParam } = createParamHooks<QuoteDetailPageParams>()

const QuoteDetailPage = () => {
  const [insightId] = useUUIDParam('insightId')
  const [quoteId] = useUUIDParam('quoteId')

  const { replaceRoute } = useRouting()
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const {
    data: { insightById: insight } = {},
    loading,
    refetch,
  } = useQuery<InsightWithQuoteByIdResponse>(insightWithQuoteById, {
    variables: { insightId, quoteId },
    skip: !insightId || !quoteId,
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load quote', { location: 'QuoteDetailPage.quoteById', quoteId })
    },
  })

  const quote = insight?.quote

  useOnRefresh(refetch)

  const [, shareLink] = useShareLink({
    link: `/insights/${insight?.id}/quotes/${quoteId}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('insights.quotes.share.message', {
      title: quote?.linkPreview.title ?? '',
      interpolation: { escapeValue: false },
    })}`,
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: ({ tintColor }) => <HeaderTitle tintColor={tintColor}>{t('insights.quotes.title')}</HeaderTitle>,
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
  }, [quote, setScreenOptions, shareLink, t, colors.black300, theme.colors.background10])

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
              <HoliHeading level="1">{quote.linkPreview.title}</HoliHeading>
            </View>

            <View style={[mixins.container, styles.section, styles.curvedTop, styles.curvedBottom]}>
              <View style={{ flexDirection: 'row', gap: Spacing.xxs }}>
                <Avatar
                  size="xs"
                  imgSrc={insight!.creator?.avatar || undefined} // eslint-disable-line @typescript-eslint/no-non-null-assertion
                  imgPlaceholder={insight!.creator?.avatarBlurhash || undefined} // eslint-disable-line @typescript-eslint/no-non-null-assertion
                  label={insight!.creator?.fullName ?? ''} // eslint-disable-line @typescript-eslint/no-non-null-assertion
                  initials={insight!.creator?.avatarLabel ?? ''} // eslint-disable-line @typescript-eslint/no-non-null-assertion
                />

                <HoliHeading level="3">{t('insights.quotes.detail.subtitle')}</HoliHeading>
              </View>

              <HoliGap size="s" />
              <QuoteCard.QuoteOnly quote={quote} quoteColor="#A3DAFC" />
              <HoliGap size="s" />
              <HoliText>{quote.comment}</HoliText>
              {!!quote && (
                <View style={styles.reaction}>
                  <InsightReactions item={quote} itemType={ItemType.QUOTE} />
                </View>
              )}
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
            onPress={() => Linking.openURL(quote.link)}
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
    } as ImageStyle,

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
    reaction: {
      width: '100%',
      alignItems: 'flex-end',
    },
  })

export default memo(QuoteDetailPage)
