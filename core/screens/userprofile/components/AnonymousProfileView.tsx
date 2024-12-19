import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import RegistrationButton from '@holi/core/auth/components/RegistrationButton'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { TrackingEvent } from '@holi/core/tracking'
import { FolderLock, Help, IdCard, Information, Sun, SunFilled } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'

const AnonymousProfileView = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const { theme, toggleDarkMode } = useTheme()
  const { colors } = theme
  const styles = getStyles(theme)

  const [themeToggleEnabled] = useFeatureFlag(FeatureFlagKey.THEME_TOGGLE)

  const setScreenOptions = useSetScreenOptions()
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" widthOfScreen={0.6} tintColor={tintColor}>
          {t('profile.title')}
        </HeaderTitle>
      ),
      title: '',
      // explicitly set to `null` to override `headerRight` after logout
      headerRight: () => null,
    })
  }, [setScreenOptions, t])

  return (
    <ScrollView style={{ backgroundColor: colors.background20 }}>
      {/* Header */}
      <View style={styles.headerSection}>
        <HoliContainer>
          <HoliBox padding={[16, 0, 24, 0]}>
            <View style={styles.header}>
              <View style={styles.avatarName}>
                <Avatar label={t('profile.anonymous.you')} initials=":)" size="lg" />

                <HoliGap size="s" direction="horizontal" />

                <HoliText style={styles.nameContainer} size="large" testID="user-profile-full-name">
                  {t('profile.anonymous.you')}
                </HoliText>
              </View>

              <View style={styles.profileButtonWrapper}>
                <RegistrationButton variant="primary" inline trackingEvent={TrackingEvent.Auth.RegisterButtonPressed} />

                <ButtonTracked
                  variant="secondary"
                  inline
                  label={t('auth.loginProtection.login')}
                  onPress={() => navigate('/login')}
                  testID={'anonymous-profile-login-btn'}
                  trackingEvent={TrackingEvent.Auth.LoginButtonPressed}
                />
              </View>
            </View>
          </HoliBox>
        </HoliContainer>
      </View>

      {/* Settings */}
      <HoliContainer>
        <HoliGap size="xs" />

        <MoreOptionItem
          label={t('profile.settings.tracking.title')}
          icon={IdCard}
          iconRightStyle="arrow"
          onPress={() => navigate('/profile/settings/tracking')}
          style={styles.settingsItem}
        />

        <MoreOptionItem
          label={t('profile.settings.legalDocuments.title')}
          icon={FolderLock}
          iconRightStyle="arrow"
          onPress={() => navigate('/profile/settings/legalDocuments')}
          style={styles.settingsItem}
          testID="btn-your-account"
        />

        <MoreOptionItem
          label={t('profile.settings.help.title')}
          icon={Help}
          iconRightStyle="arrow"
          onPress={() => navigate('/profile/settings/help')}
          style={styles.settingsItem}
        />

        {Platform.OS !== 'web' && (
          <MoreOptionItem
            label={t('profile.settings.aboutholiapp.title')}
            icon={Information}
            iconRightStyle="arrow"
            onPress={() => navigate('/profile/settings/aboutholiapp')}
            style={styles.settingsItem}
            testID="btn-about"
          />
        )}

        {themeToggleEnabled && (
          <MoreOptionItem
            label={t('global.theme.toggle')}
            icon={theme.dark ? Sun : SunFilled}
            onPress={toggleDarkMode}
            style={styles.settingsItem}
          />
        )}
      </HoliContainer>
    </ScrollView>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    headerSection: {
      backgroundColor: theme.colors.background10,
      borderColor: theme.colors.gray100,
      borderBottomWidth: 2,
    },
    header: {
      flexDirection: 'column',
      width: '100%',
      minWidth: 250,
      marginTop: 8,
    },
    avatarName: {
      flexDirection: 'row',
    },
    profileButtonWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: 8,
      marginTop: 16,
    },
    nameContainer: {
      flexShrink: 1,
      alignSelf: 'center',
    },
    settingsItem: {
      paddingVertical: 16,
    },
  })

export default AnonymousProfileView
