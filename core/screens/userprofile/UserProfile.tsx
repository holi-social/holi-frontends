import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import InsightsTab from '@holi/core/components/InsightsTab'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import SpacesTab from '@holi/core/components/SpacesTab'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { UserChipTypes } from '@holi/core/helpers/useUserChips'
import useBlockUser from '@holi/core/hooks/useBlockUser'
import useReportContent from '@holi/core/hooks/useReportContent'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ContentType } from '@holi/core/queries'
import { insightsByUserIdTotalResultsQuery } from '@holi/core/queries'
import { InsightsByUserIdResponse } from '@holi/core/queries'
import OtherPostsTab from '@holi/core/screens/individualPosts/components/OtherPostsTab'
import UserChipRow from '@holi/core/screens/userprofile/components/UserChipRow'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { userByIdQuery } from '@holi/core/screens/userprofile/queries'
import type { UserByIdResponse } from '@holi/core/screens/userprofile/queries'
import { CloseCircle, Flag } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type UserProfileParams = {
  userId: string
}

const { useParam } = createParamHooks<UserProfileParams>()

const UserProfile = () => {
  const { t } = useTranslation()
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { userId: authenticatedUserId, isLoggedIn } = useAuth()
  const [userId = ''] = useParam('userId')

  useEffect(() => {
    if (isLoggedIn && userId === authenticatedUserId) {
      replaceRoute('/profile')
    }
  }, [replaceRoute, isLoggedIn, userId, authenticatedUserId])

  const {
    loading,
    data,
    refetch: refetchUser,
  } = useQuery<UserByIdResponse>(userByIdQuery, {
    variables: { userId },
    fetchPolicy: isSSR ? 'network-only' : 'cache-and-network',
    skip: !userId,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to load user', {
        location: 'UserProfile.fetchUser',
      })
    },
  })
  const { refreshing, onRefresh } = useOnRefresh(refetchUser)

  const user = data?.userById
  const userFullName = user?.fullName || t('user.profileView.anonymous')
  const successMsg = t('user.profileView.block.successMessage', { name: userFullName })

  const tabBarStyle = useBreakpointMatcher([[dimensions.breakpointS, mixins.container]])

  const [isLoadingBlockUser, blockUser] = useBlockUser(userId, successMsg)
  const [isLoadingReport, reportContent] = useReportContent({
    id: userId,
    contentType: ContentType.USER,
    successMsg: t('global.report.successMessage'),
  })

  const { data: dataInsights } = useQuery<InsightsByUserIdResponse>(insightsByUserIdTotalResultsQuery, {
    variables: { userId },
    skip: !userId,
    onError: (error) =>
      logError(error, 'Failed to load insights for user', {
        location: 'UserProfile.insightsByUserIdTotalResultsQuery',
      }),
  })

  const hasInsights = !!dataInsights?.insightsByUserId?.totalResults

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('profile.title'),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerRight: () => (
        <HoliActionDrawer.Drawer label="user-profile-drawer">
          <HoliActionDrawer.Action icon={Flag} isLoading={isLoadingReport} title={t('global.report')} showConfirmation>
            <HoliActionDrawer.Confirmation
              title={t('user.profileView.report.confirmation.title', { name: userFullName })}
              description={t('user.profileView.report.confirmation.description', { name: userFullName })}
              handleConfirmation={reportContent}
              hasDismissBtn
              requireLogin
            />
          </HoliActionDrawer.Action>
          <HoliActionDrawer.Action
            icon={CloseCircle}
            isLoading={isLoadingBlockUser}
            title={t('profile.block', { name: userFullName })}
            showConfirmation
          >
            <HoliActionDrawer.Confirmation
              title={t('user.profileView.block.confirmation.title', { name: userFullName })}
              description={t('user.profileView.block.confirmation.description', { name: userFullName })}
              handleConfirmation={blockUser}
              hasDismissBtn
              requireLogin
            />
          </HoliActionDrawer.Action>
        </HoliActionDrawer.Drawer>
      ),
    })
  }, [
    isLoadingBlockUser,
    t,
    userFullName,
    blockUser,
    reportContent,
    isLoadingReport,
    setScreenOptions,
    colors.background10,
  ])

  if (!userId || (loading && !user)) {
    // TODO: replace with proper loading indicator
    return (
      <DefaultLayout>
        <View style={[mixins.container, styles.messageContainer]}>
          <HoliText>{t('rootProvider.loading.profile')}</HoliText>
        </View>
      </DefaultLayout>
    )
  }

  if (!user) {
    return (
      <DefaultLayout>
        <View style={[mixins.container, styles.messageContainer]}>
          <HoliText>{t('user.profileView.noUser')}</HoliText>
        </View>
      </DefaultLayout>
    )
  }

  const hasInterests = !!user.interests?.length
  const hasSdgs = !!user.sdgs?.length
  const hasSkills = !!user.skills?.length
  const hasInfo = user.engagementLevel || hasInterests || hasSdgs || hasSkills

  return (
    <ScrollHeaderLayout.Refreshable
      refreshableProps={{
        refreshing,
        onRefresh,
      }}
    >
      <View style={[mixins.container, styles.container]}>
        <UserProfileView user={user} />
      </View>
      <HoliTabs
        style={{ marginTop: 24, flex: 1 }}
        tabBarStyle={tabBarStyle}
        id="profile-tabs"
        tabs={[
          {
            title: t('profile.tabs.profile'),
            children: (
              <View style={styles.profileContainer}>
                {user.engagementLevel && (
                  <View style={[mixins.container, styles.chipRowContainer]} key="engagementLevel">
                    <HoliChipRow title={t('profile.engagementLevel')}>
                      <HoliChip
                        text={t(`user.engagementLevel.title.${user.engagementLevel}`)}
                        label={t(`user.engagementLevel.title.${user.engagementLevel}`)}
                        style={styles.chip}
                        disabled
                      />
                    </HoliChipRow>
                  </View>
                )}
                {hasInterests && (
                  <View style={[mixins.container, styles.chipRowContainer]} key={UserChipTypes.INTERESTS}>
                    <UserChipRow user={user} keyInUserObject={UserChipTypes.INTERESTS} numberOfLines={1} />
                  </View>
                )}
                {hasSdgs && (
                  <View style={[mixins.container, styles.chipRowContainer]} key={UserChipTypes.SDGS}>
                    <UserChipRow user={user} keyInUserObject={UserChipTypes.SDGS} numberOfLines={1} />
                  </View>
                )}
                {hasSkills && (
                  <View style={[mixins.container, styles.chipRowContainer]} key={UserChipTypes.SKILLS}>
                    <UserChipRow user={user} keyInUserObject={UserChipTypes.SKILLS} numberOfLines={1} />
                  </View>
                )}
                {!hasInfo && (
                  <View style={styles.infoContainer} key="missingInfo">
                    <HoliText style={styles.infoText}>{t('profile.missingInfo')}</HoliText>
                  </View>
                )}
              </View>
            ),
          },
          ...(hasInsights
            ? [
                {
                  title: t('profile.tabs.insight'),
                  children: <InsightsTab emptyText={t('profile.tabs.insight.empty')} userId={user.id} />,
                },
              ]
            : []),
          {
            title: t('profile.tabs.spaces'),
            children: (
              <SpacesTab
                emptyText={t('profile.userprofile.tabs.spaces.empty', { fullName: user.fullName })}
                memberId={user.id}
              />
            ),
          },
          {
            title: t('individuals.post.name'),
            children: <OtherPostsTab userId={user.id} userFirstName={user.firstName} />,
          },
        ]}
      />
    </ScrollHeaderLayout.Refreshable>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'baseline',
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: dimensions.topBarHeight + 50,
    },
    chipRowContainer: {
      marginTop: 24,
    },
    chip: {
      marginRight: 8,
      marginBottom: 8,
    },
    headerEditButton: {
      marginLeft: 24,
      marginRight: Platform.OS === 'web' ? 24 : 0,
    },
    infoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 56,
      paddingVertical: 72,
    },
    infoText: {
      textAlign: 'center',
      color: theme.colors.foreground20,
    },
    profileContainer: {
      paddingBottom: 24,
    },
  })

export default withProfiler(memo(UserProfile), { name: 'UserProfile' })
