import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import InsightsTab from '@holi/core/components/InsightsTab'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import SpacesTab from '@holi/core/components/SpacesTab'
import { UserByIdResponse, userByIdQuery } from '@holi/core/domain/shared/queries'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { UserChipTypes } from '@holi/core/helpers/useUserChips'
import useBlockUser from '@holi/core/hooks/useBlockUser'
import useReportContent from '@holi/core/hooks/useReportContent'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ContentType, ContentType3K } from '@holi/core/queries'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import OtherPostsTab from '@holi/core/screens/individualPosts/components/OtherPostsTab'
import UserChipRow from '@holi/core/screens/userprofile/components/UserChipRow'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { CloseCircle, Flag } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import ChipLabel from '@holi/ui/no-name/components/chips/ChipLabel'
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

  const loginState = useLoggedInUser()
  const [userId = ''] = useParam('userId')

  const [activeTab, setActiveTab] = useState<string>('profile')

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
  const successMsg = t('user.profileView.block.successMessage', { name: userFullName })

  const [isLoadingBlockUser, blockUser] = useBlockUser(userId, successMsg)
  const [isLoadingReport, reportContent] = useReportContent({
    id: userId,
    contentType3k: ContentType3K.USER,
    contentType: ContentType.USER,
    successMsg: t('global.report.successMessage'),
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('profile.title'),
      headerTransparent: false,
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
  }, [isLoadingBlockUser, t, userFullName, blockUser, reportContent, isLoadingReport, setScreenOptions])

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
    <ScrollHeaderLayout headerRelation="none" style={styles.layout} contentContainerStyle={styles.content}>
      <View style={[mixins.container, styles.container]}>
        <UserProfileView user={user} />
      </View>

      <HoliTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        data={[
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
                    <UserChipRow
                      user={user}
                      keyInUserObject={UserChipTypes.INTERESTS}
                      numberOfLines={1}
                      color="green"
                    />
                  </View>
                )}
                {hasSdgs && (
                  <View style={styles.chipRowContainer} key={UserChipTypes.SDGS}>
                    <UserChipRow user={user} keyInUserObject={UserChipTypes.SDGS} numberOfLines={1} color="white" />
                  </View>
                )}
                {hasSkills && (
                  <View style={styles.chipRowContainer} key={UserChipTypes.SKILLS}>
                    <UserChipRow user={user} keyInUserObject={UserChipTypes.SKILLS} numberOfLines={1} color="blue" />
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
            key: 'posts',
            tabTitle: t('individuals.post.name'),
            content: () => <OtherPostsTab userId={user.id} userFirstName={user.firstName} />,
          },
          {
            key: 'insights',
            tabTitle: t('profile.tabs.insight'),
            content: () => <InsightsTab emptyText={t('profile.tabs.insight.empty')} userId={user.id} />,
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
        ]}
        keyExtractor={(item) => item.key}
        renderTabContent={({ item }) => item.content()}
        backgroundColor={colors.background20}
        testID="profile-tabs"
      />
    </ScrollHeaderLayout>
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
    },
    container: {
      alignItems: 'baseline',
      backgroundColor: theme.colors.background10,
      paddingBottom: 16,
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: dimensions.topBarHeight + 50,
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
