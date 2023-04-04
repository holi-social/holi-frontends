import { useLazyQuery } from '@apollo/client'
import React, { Suspense, memo, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import type { InsightsTabProps } from '@holi/core/components/InsightsTab'
import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import type { SpacesTabProps } from '@holi/core/components/SpacesTab'
import NotFound from '@holi/core/errors/components/NotFound'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { ContentType } from '@holi/core/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import UserChipRow from '@holi/core/screens/userprofile/components/UserChipRow'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { userByIdQuery } from '@holi/core/screens/userprofile/queries'
import type { UserByIdResponse } from '@holi/core/screens/userprofile/queries'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

/** TODO: Suspence currently only works on web. To make it work for
 * mobile we need to move to the new React Native architecture */
const SpacesTab = dynamicImport<SpacesTabProps>(() => import('@holi/core/components/SpacesTab'))
const InsightsTab = dynamicImport<InsightsTabProps>(() => import('@holi/core/components/InsightsTab'))

export type UserProfileParams = {
  userId: string
}

const { useParam } = createParam<UserProfileParams>()

const UserProfile = () => {
  const { t } = useTranslation()
  const { replaceRoute } = useRouting()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()

  const { userId: authenticatedUserId } = useAuth()
  const { isLoggedIn } = useLoggedInUser()
  const [userId = ''] = useParam('userId')

  useLayoutEffect(() => {
    if (isLoggedIn && userId === authenticatedUserId) {
      replaceRoute('/profile')
    }
  }, [replaceRoute, isLoggedIn, userId, authenticatedUserId])

  const [fetchUser, { loading, error, data }] = useLazyQuery<UserByIdResponse>(userByIdQuery, {
    variables: { userId },
    fetchPolicy: 'network-only',
  })

  const user = data?.userById
  const userFullName = user?.fullName || t('user.profileView.anonymous')

  const { setOptions } = useUnifiedNavigation()
  const { visible, show, hide } = useModalState()

  useLayoutEffect(
    () =>
      setOptions({
        title: t('profile.title'),
        headerTransparent: true,
        headerStyle: { backgroundColor: colors.background10 },
        headerRight: ({ tintColor }) => (
          <MoreOptionsButtonWithModal
            label={t('insights.post.preview.more')}
            showOptions={visible}
            onPress={show}
            onModalDismiss={hide}
            tintColor={tintColor}
          >
            <ReportBlockOptionButton
              action="report"
              label={t('user.profileView.report.title', { name: userFullName })}
              objectId={userId}
              contentType={ContentType.USER}
              style={styles.moreOptionItem}
              confirmationModalProps={{
                title: t('user.profileView.report.confirmation.title', { name: userFullName }),
                description: t('user.profileView.report.confirmation.description', { name: userFullName }),
              }}
              successMessage={t('global.report.successMessage')}
              onConfirm={hide}
            />

            <ReportBlockOptionButton
              action="block"
              label={t('profile.block', { name: userFullName })}
              objectId={userId}
              style={styles.moreOptionItem}
              confirmationModalProps={{
                title: t('user.profileView.block.confirmation.title', { name: userFullName }),
                description: t('user.profileView.block.confirmation.description', { name: userFullName }),
              }}
              successMessage={t('user.profileView.block.successMessage', { name: userFullName })}
              icon="close-circle"
              tintColor={colors.error30}
              onConfirm={hide}
            />
          </MoreOptionsButtonWithModal>
        ),
      }),
    [hide, setOptions, show, t, userFullName, userId, visible]
  )

  // TODO: workaround for params always being undefined on initial page load
  // > will probably be solved with ssr
  // see https://github.com/nandorojo/solito/issues/100
  useEffect(() => {
    if (userId && !loading && !user) {
      fetchUser()
    }
  }, [fetchUser, userId, loading, user])

  if (error) {
    if (isNotFoundError(error)) {
      return <NotFound />
    } else {
      displayError(error)
    }
  }

  if (!userId || loading) {
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
    <DefaultScrollHeaderLayout>
      <View style={[mixins.container, styles.container]}>
        <UserProfileView user={user} />
      </View>
      <HoliTabs
        style={{ marginTop: 24, flex: 1 }}
        id="profile-tabs"
        tabs={[
          {
            title: t('profile.tabs.profile'),
            children: [
              user.engagementLevel && (
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
              ),
              hasInterests && (
                <View style={[mixins.container, styles.chipRowContainer]} key="interests">
                  <UserChipRow user={user} keyInUserObject={'interests'} numberOfLines={1} />
                </View>
              ),
              hasSdgs && (
                <View style={[mixins.container, styles.chipRowContainer]} key="sdgs">
                  <UserChipRow user={user} keyInUserObject={'sdgs'} numberOfLines={1} />
                </View>
              ),
              hasSkills && (
                <View style={[mixins.container, styles.chipRowContainer]} key="skills">
                  <UserChipRow user={user} keyInUserObject={'skills'} numberOfLines={1} />
                </View>
              ),
              !hasInfo && (
                <View style={styles.infoContainer} key="missingInfo">
                  <HoliText style={styles.infoText}>{t('profile.missingInfo')}</HoliText>
                </View>
              ),
            ],
          },
          {
            title: t('profile.tabs.insight'),
            children: (
              <Suspense fallback={<HoliLoader />}>
                <InsightsTab emptyText={t('profile.tabs.insight.empty')} userId={user.id} />
              </Suspense>
            ),
          },
          {
            title: t('profile.tabs.spaces'),
            children: (
              <Suspense fallback={<HoliLoader />}>
                <SpacesTab
                  emptyText={t('profile.userprofile.tabs.spaces.empty', { fullName: user.fullName })}
                  memberId={user.id}
                />
              </Suspense>
            ),
          },
        ]}
      />
    </DefaultScrollHeaderLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'baseline',
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: vars.topBarHeight + 50,
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
    color: colors.foreground20,
  },
  moreOptionItem: {
    justifyContent: 'center',
    paddingVertical: 18,
  },
})

export default memo(UserProfile)
