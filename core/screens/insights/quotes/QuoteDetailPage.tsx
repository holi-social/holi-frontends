import { useQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageStyle, Linking, Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { InsightWithQuoteByIdResponse, insightWithQuoteById } from '@holi/core/screens/insights/queries'
import QuoteCard from '@holi/core/screens/insights/quotes/QuoteCard'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled, Share, ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type QuoteDetailPageParams = {
  insightId: string
  quoteId: string
}

const { useParam } = createParamHooks<QuoteDetailPageParams>()

const QuoteDetailPage = () => {
  const [insightId] = useParam('insightId')
  const [quoteId] = useParam('quoteId')

  const { replaceRoute } = useRouting()
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()
  const { t } = useTranslation()

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

  const { refreshing, onRefresh } = useOnRefresh(refetch)

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
      title: t('insights.quotes.title'),
      headerTransparent: false,
      headerTintColor: colors.black300,
      headerShown: true,
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
  }, [quote, setScreenOptions, shareLink, t])

  return (
    <>
      <StatusBar style="dark" animated />

      <ScrollHeaderLayout.Refreshable refreshableProps={{ refreshing, onRefresh }} style={styles.wrapper} headerOverlap>
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
                <HoliAvatar
                  size="micro"
                  imageSrc={insight.creator.avatar}
                  imageBlurhash={insight.creator.avatarBlurhash}
                  label={insight.creator.fullName ?? ''}
                  initials={insight.creator.avatarLabel ?? ''}
                />

                <HoliHeading level="3">{t('insights.quotes.detail.subtitle')}</HoliHeading>
              </View>

              <HoliGap size="s" />
              <QuoteCard.QuoteOnly quote={quote} />
              <HoliGap size="s" />
              <HoliText>{quote.comment}</HoliText>
            </View>
          </>
        ) : (
          <Skeleton />
        )}
      </ScrollHeaderLayout.Refreshable>
      <View style={[mixins.container, styles.openLinkButton]}>
        {(!quote || loading) && <HoliButtonLoading loading loadingLabel={t('global.loading')} label="" />}
        {quote && !loading && (
          <HoliButtonLoading
            icon={ShareBox}
            label={t('insights.quotes.detail.visitLinkButton.label')}
            onPress={() => Linking.openURL(quote.link)}
          />
        )}
      </View>
    </>
  )
}

const Skeleton = () => {
  const mixins = useStyleMixins()

  return (
    <>
      <View style={[mixins.container, styles.bannerImage]}>
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

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background20,
    paddingBottom: 124,
  },
  header: {
    marginBottom: 2,
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

  quoteImage: {
    ...Platform.select({ web: { height: '100%' } }),
  },
  section: {
    backgroundColor: colors.background10,
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
