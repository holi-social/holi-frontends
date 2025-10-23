import { useQuery } from '@apollo/client/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Linking, Platform, StyleSheet, View, type ViewStyle } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { LinkType, useShareLink } from '@holi/core/navigation/hooks/useShareLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { type InsightWithInitiativeResponse, insightWithInitiative } from '@holi/core/screens/insights/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled, Share, ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Stack } from 'holi-bricks/components/stack'
import ReactionCount from '@holi/core/components/reactions/ReactionCount'
import InsightReactions, { ItemType } from '@holi/core/screens/insights/InsightReactions'
import { Text } from 'holi-bricks/components/text'
import { useApolloNotFoundErrorHandling } from '@holi/core/hooks/useApolloNotFoundErrorHandling'

export type InitiativeDetailPageParams = {
  insightId: string
  initiativeId: string
}

const { useUUIDParam } = createParamHooks<InitiativeDetailPageParams>()

const InitiativeDetailPage = () => {
  const [insightId] = useUUIDParam('insightId')
  const [initiativeId] = useUUIDParam('initiativeId')
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const {
    data: { insightById } = {},
    refetch,
    loading,
    error,
  } = useQuery<InsightWithInitiativeResponse>(insightWithInitiative, {
    variables: { insightId, initiativeId },
    notifyOnNetworkStatusChange: true,
    skip: !insightId || !initiativeId,
  })

  useOnRefresh(refetch)

  useApolloNotFoundErrorHandling(error, 'Failed to load initiative', {
    location: 'InitiativeDetailPage.insightWithInitiative',
    initiativeId,
  })

  const initiative = insightById?.initiative

  const shareLink = useShareLink({
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
            buttonElement={<HoliIcon icon={MoreFilled} colorOverride={theme.colors.black300} />}
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
  }, [t, setScreenOptions, shareLink, theme.colors.black300, insightId])

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
              <Text headingLevel="1" size="3xl" numberOfLines={3}>
                {initiative.linkPreview.title}
              </Text>
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
                  <Text size="lg">{t('insights.recommendations.creator_reason')}</Text>
                </View>

                <Text margin={{ bottom: 'xs' }}>{initiative.comment}</Text>
                <Stack direction="row" justifyContent="space-between">
                  <ReactionCount count={initiative.reactions.HEART} />
                  <InsightReactions item={initiative} itemType={ItemType.INITIATIVE} />
                </Stack>
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
