import { useLazyQuery } from '@apollo/client'
import React, { memo, useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import NotFound from '@holi/core/errors/components/NotFound'
import { displayError, isNotFoundError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import UserChipRow from '@holi/core/screens/userprofile/components/UserChipRow'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { UserByIdResponse, userByIdQuery } from '@holi/core/screens/userprofile/queries'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type UserProfileParams = {
  userId: string
}
const { useParam } = createParam<UserProfileParams>()

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const UserProfile: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const { replaceRoute } = useRouting()
  const mixins = useStyleMixins()

  const { isLoggedIn, userId: authenticatedUserId } = useContext(AuthContext)
  const [userId = ''] = useParam('userId')

  useLayoutEffect(() => {
    if (isLoggedIn && userId === authenticatedUserId) {
      replaceRoute('/profile')
    }
  }, [replaceRoute, isLoggedIn, userId, authenticatedUserId])

  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  useLayoutEffect(() => setOptions({ title: t('profile.title') }), [setOptions, t])

  const [fetchUser, { loading, error, data }] = useLazyQuery<UserByIdResponse>(userByIdQuery, {
    variables: { userId },
    fetchPolicy: 'network-only',
  })

  const user = data?.userById

  // TODO: workaround for params always being undefined on initial page load
  // > will probably be solved with ssr
  // see https://github.com/nandorojo/solito/issues/100
  useLayoutEffect(() => {
    if (userId && !loading && !user) {
      fetchUser()
    }
  }, [fetchUser, userId, loading, user])

  if (error) {
    if (isNotFoundError(error)) {
      return <NotFound />
    } else {
      displayError(error, t('user.userProfile.error.fetching'))
    }
  }

  if (!userId || loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('rootProvider.loading.profile')}</HoliText>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('user.profileView.noUser')}</HoliText>
      </View>
    )
  }

  const hasInterests = !!user.interests?.length
  const hasSdgs = !!user.sdgs?.length
  const hasSkills = !!user.skills?.length
  const hasInfo = user.engagementLevel || hasInterests || hasSdgs || hasSkills

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <View style={[mixins.container, styles.container]}>
        <UserProfileView user={user} />
      </View>
      <HoliTabs
        style={{ marginTop: 24 }}
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
              <View style={styles.infoContainer}>
                <HoliText style={styles.infoText}>{t('profile.tabs.insight.empty')}</HoliText>
              </View>
            ),
          },
        ]}
      />
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'baseline',
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
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
    color: colors.fontColorGrey,
  },
})

export default memo(UserProfile)
