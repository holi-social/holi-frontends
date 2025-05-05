import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { ChipLabel } from 'holi-bricks/components/chips'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import InsightsTab from '@holi/core/components/InsightsTab'
import SpacesTab from '@holi/core/components/SpacesTab'
import { type UserByIdResponse, userByIdQuery } from '@holi/core/domain/shared/queries'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useBlockUser } from '@holi/core/hooks/useBlockUser'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import {
  ContentType,
  ContentType3K,
  type InsightsByUserIdResponse,
  insightsByUserIdTotalResultsQuery,
} from '@holi/core/queries'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import OtherPostsTab from '@holi/core/screens/individualPosts/components/OtherPostsTab'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { CloseCircle, Flag } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import ConnectionsTab from '@holi/core/screens/userprofile/components/ConnectionsTab'
import { UserTermsRow } from '@holi/core/screens/userprofile/components/UserTermsRow'
import { UserChipTypes } from '@holi/core/screens/userprofile/types'

export type UserProfileParams = {
  userId: string
}

const { useUUIDParam } = createParamHooks<UserProfileParams>()

const UserProfile = () => {
  const { t } = useTranslation()
  const { replaceRoute } = useRouting()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const loginState = useLoggedInUser()
  const [userId = ''] = useUUIDParam('userId')

  const [activeTab, setActiveTab] = useState<string>('posts')

  useEffect(() => {
    if (loginState.isLoggedIn && userId === loginState.user.id) {
      replaceRoute('/profile')
    }
  }, [replaceRoute, loginState, userId])

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
  useOnRefresh(refetchUser)

  const user = data?.userById
  const userFullName = user?.fullName || t('user.profileView.anonymous')

  const [isBlockingUser, blockUser] = useBlockUser()

  const { data: dataInsights } = useQuery<InsightsByUserIdResponse>(insightsByUserIdTotalResultsQuery, {
    variables: { userId: user?.id ?? userId },
    skip: !userId,
    errorPolicy: 'ignore',
    onError: (error) => {
      logError(error, 'Failed to load insights for user', {
        location: 'UserProfile.insightsByUserIdTotalResultsQuery',
      })
    },
  })

  const totalInsights = dataInsights?.insightsByUserId?.totalResults ?? 0
  const hasInsights = totalInsights > 0

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('profile.title'),
      headerRight: () => (
        <HoliActionDrawer.Drawer label="user-profile-drawer">
          <HoliActionDrawer.Action
            icon={Flag}
            title={t('global.report')}
            handleAction={() => navigateWithAuth(`/report/${userId}/${ContentType.USER}/${ContentType3K.USER}`)}
          />
          <HoliActionDrawer.Action
            icon={CloseCircle}
            isLoading={isBlockingUser}
            title={t('profile.block', { name: userFullName })}
            showConfirmation
          >
            <HoliActionDrawer.Confirmation
              title={t('user.profileView.block.confirmation.title', { name: userFullName })}
              description={t('user.profileView.block.confirmation.description', { name: userFullName })}
              handleConfirmation={() => {
                if (user)
                  blockUser(user, { successMsg: t('user.profileView.block.successMessage', { name: userFullName }) })
              }}
              hasDismissBtn
              requireLogin
            />
          </HoliActionDrawer.Action>
        </HoliActionDrawer.Drawer>
      ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} fallbackRoute="/" />,
    })
  }, [t, userFullName, blockUser, navigateWithAuth, userId, setScreenOptions, user, isBlockingUser])

  if (!userId || (loading && !user)) {
    return (
      <DefaultLayout>
        <HoliContainer>
          <HoliLoader />
        </HoliContainer>
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

  const hasInterests = !!user.interestsV2?.length
  const hasSkills = !!user.skillsV2?.length
  const hasInfo = user.engagementLevel || hasInterests || hasSkills

  const tabs = [
    {
      key: 'posts',
      tabTitle: t('individuals.post.name'),
      content: () => <OtherPostsTab userId={user.id} userFirstName={user.firstName} />,
    },
    {
      key: 'profile',
      tabTitle: t('profile.tabs.profile'),
      content: () => (
        <View style={styles.profileContainer}>
          {user.engagementLevel && (
            <View style={styles.chipRowContainer} key="engagementLevel">
              <HoliChipRow title={t('profile.engagementLevel')}>
                <ChipLabel color="white">{t(`user.engagementLevel.title.${user.engagementLevel}`)}</ChipLabel>
              </HoliChipRow>
            </View>
          )}
          {hasInterests && (
            <View style={styles.chipRowContainer} key={UserChipTypes.INTERESTS}>
              <UserTermsRow termType="topic" />
            </View>
          )}
          {hasSkills && (
            <View style={styles.chipRowContainer} key={UserChipTypes.SKILLS}>
              <UserTermsRow termType="skill" />
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

    {
      key: 'spaces',
      tabTitle: t('profile.tabs.spaces'),
      content: () => (
        <SpacesTab
          emptyText={t('profile.userprofile.tabs.spaces.empty', { fullName: user.fullName })}
          memberId={user.id}
        />
      ),
    },
  ]

  if (hasInsights) {
    tabs.splice(1, 0, {
      key: 'insights',
      tabTitle: t('profile.tabs.insight'),
      content: () => <InsightsTab userId={user.id} />,
    })
  }

  if (loginState.isLoggedIn) {
    tabs.push({
      key: 'connections',
      tabTitle: t('profile.tabs.connections'),
      content: () => <ConnectionsTab emptyText={t('user.profile.connections.title.empty')} userId={user.id} />,
    })
  }

  return (
    <ScrollViewRefreshable style={styles.layout} contentContainerStyle={styles.content}>
      <View style={[mixins.container, styles.container]}>
        <UserProfileView user={user} />
      </View>

      <HoliTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        data={tabs}
        keyExtractor={(item) => item.key}
        renderTabContent={({ item }) => item.content()}
        backgroundColor={colors.background20}
        testID="profile-tabs"
      />
    </ScrollViewRefreshable>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layout: {
      flex: 1,
      backgroundColor: theme.colors.background20,
    },
    content: {
      minHeight: '100%',
      backgroundColor: theme.colors.background10,
    },
    container: {
      alignItems: 'baseline',
      backgroundColor: theme.colors.background10,
      paddingBottom: 16,
    },
    messageContainer: {
      alignItems: 'center',
    },
    chipRowContainer: {
      marginTop: 24,
      gap: 8,
    },
    chipFont: {
      color: theme.colors.black300,
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
