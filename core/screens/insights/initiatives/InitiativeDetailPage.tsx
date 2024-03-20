import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, ImageStyle, Linking, Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { InsightWithInitiativeResponse, insightWithInitiative } from '@holi/core/screens/insights/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MoreFilled, Share, ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

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

  const { refreshing, onRefresh } = useOnRefresh(refetch)

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
      headerTransparent: true,
      headerStyle: {
        backgroundColor: theme.colors.background10,
      },
    })
  }, [t, setScreenOptions, shareLink, theme.colors.black300, theme.colors.background10])

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        style={styles.layout}
        contentStyle={[mixins.container, styles.container]}
      >
        {initiative && !loading ? (
          <>
            <HoliImageBackground
              source={{ uri: initiative.linkPreview.image }}
              resizeMode="cover"
              style={styles.bannerImage}
            />
            <View style={[mixins.container, styles.section, styles.curvedBottom, styles.header]}>
              <LinkInfo icon={initiative.linkPreview.icon} link={initiative.link} />
              <HoliGap size="s" />
              <HoliHeading level="1" size="l" numberOfLines={3}>
                {initiative.linkPreview.title}
              </HoliHeading>
            </View>
          </>
        ) : (
          <Skeleton />
        )}
      </ScrollHeaderLayout.Refreshable>
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
    } as ImageStyle,
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

export default InitiativeDetailPage
