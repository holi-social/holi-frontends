import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Linking, Platform, StyleSheet, View, type ViewStyle } from 'react-native'

import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { type InsightWithInitiativeResponse, insightWithInitiative } from '@holi/core/screens/insights/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled, Share, ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'

export type InitiativeDetailPageParams = {
  insightId: string
  initiativeId: string
}

const { useParam } = createParamHooks<InitiativeDetailPageParams>()

const InitiativeDetailPage = () => {
  const [insightId] = useParam('insightId')
  const [initiativeId] = useParam('initiativeId')
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const {
    data: { insightById } = {},
    refetch,
    loading,
  } = useQuery<InsightWithInitiativeResponse>(insightWithInitiative, {
    variables: { insightId, initiativeId },
    notifyOnNetworkStatusChange: true,
    skip: !insightId || !initiativeId,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load initiative', {
        location: 'InitiativeDetailPage.insightWithInitiative',
        initiativeId,
      })
    },
  })

  useOnRefresh(refetch)

  const initiative = insightById?.initiative

  const [, shareLink] = useShareLink({
    link: `/insights/${insightId}/initiatives/${initiativeId}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('insights.initiatives.share.message', {
      title: initiative?.linkPreview.title ?? '',
      interpolation: { escapeValue: false },
    })}`,
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('insights.initiatives.title'),
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerRight: () => {
        return (
          <HoliActionDrawer.Drawer
            label={t('global.moreOptions')}
            buttonElement={<HoliIcon icon={MoreFilled} color={theme.colors.black300} />}
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
      headerShown: true,
    })
  }, [t, setScreenOptions, shareLink, theme.colors.black300])

  return (
    <>
      <ScrollViewRefreshable style={styles.layout} contentContainerStyle={[mixins.container, styles.container]}>
        {initiative && !loading ? (
          <>
            {initiative.linkPreview.image && (
              <HoliImageBackground
                source={{ uri: initiative.linkPreview.image }}
                resizeMode="cover"
                style={styles.bannerImage}
              />
            )}
            <View style={[mixins.container, styles.section, styles.curvedBottom, styles.header]}>
              <LinkInfo icon={initiative.linkPreview.icon} link={initiative.link} />
              <HoliGap size="s" />
              <HoliHeading level="1" size="l" numberOfLines={3}>
                {initiative.linkPreview.title}
              </HoliHeading>
            </View>
            {initiative.comment && (
              <View style={styles.recommendationComment}>
                <View style={styles.recommendationHeadline}>
                  <HoliLocalImage
                    imageSource={require('@holi/ui/assets/img/holi/holi_brandmark.svg')}
                    label="holi-logo"
                    width={18}
                    height={18}
                    resizeMode="contain"
                    isSvg
                    style={styles.logo}
                  />
                  <HoliText bold>{t('insights.recommendations.creator_reason')}</HoliText>
                </View>

                <HoliText>{initiative.comment}</HoliText>
              </View>
            )}
          </>
        ) : (
          <Skeleton />
        )}
      </ScrollViewRefreshable>

      {initiative && !loading && (
        <View style={styles.footer}>
          <HoliButtonLoading
            style={styles.linkButton}
            role="link"
            label={t('global.visitLinkButton.label')}
            icon={ShareBox}
            onPress={() => Linking.openURL(initiative?.link || '')}
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
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layout: {
      paddingTop: 42,
      minHeight: '100%',
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        web: {
          minHeight: '100vh' as DimensionValue,
        },
      }),
    },
    container: {
      paddingHorizontal: 0,
      paddingBottom: dimensions.bottomBarHeight + 100,
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
    recommendationComment: {
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xs,
    },
    recommendationHeadline: {
      flexDirection: 'row',
      gap: Spacing['3xs'],
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    logo: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.brandA200,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

export default InitiativeDetailPage
