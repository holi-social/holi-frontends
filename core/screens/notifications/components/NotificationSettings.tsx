import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useGlobalNotificationPreferences } from '@holi/core/screens/notifications/hooks/useGlobalNotificationPreferences'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliRoundedSection from '@holi/ui/components/molecules/HoliRoundedSection'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const NotificationSettings = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()

  const { globalPreferences, toggleEmailPreference, togglePushPreference, globalPreferencesUpdating } =
    useGlobalNotificationPreferences()

  useLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.notifications.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <ScrollHeaderLayout.Default backgroundColor={colors.background20}>
        <LoginProtection>
          <View style={[mixins.container, styles.accountSettings]}>
            <HoliRoundedSection style={styles.firstSectionWhiteSpace} first>
              {globalPreferences ? (
                <>
                  <BellIllustration style={styles.verticalSpacing} />
                  <HoliHeading style={styles.verticalSpacing}>{t('profile.settings.notifications.title')}</HoliHeading>
                  <HoliText style={styles.verticalSpacing} color={'gray300'}>
                    {t('profile.settings.notifications.global.description')}
                  </HoliText>

                  <HoliColumns>
                    <SettingsNameColumn />
                    <HoliColumn>
                      <HoliColumns>
                        <SettingsCheckBoxColumn>
                          <HoliText color={'gray300'}>
                            {t('profile.settings.notifications.column.header.push')}
                          </HoliText>
                        </SettingsCheckBoxColumn>
                        <SettingsCheckBoxColumn>
                          <HoliText color={'gray300'}>
                            {t('profile.settings.notifications.column.header.email')}
                          </HoliText>
                        </SettingsCheckBoxColumn>
                      </HoliColumns>
                    </HoliColumn>
                  </HoliColumns>

                  <HoliColumns>
                    <SettingsNameColumn>
                      <HoliText>{t('profile.settings.notifications.global.entry')}</HoliText>
                    </SettingsNameColumn>
                    <SettingsCheckBoxColumn>
                      <HoliCheckbox
                        disabled={globalPreferencesUpdating}
                        checked={globalPreferences.push}
                        aria-label={t('profile.settings.notifications.column.header.push')}
                        onSelect={togglePushPreference}
                      />
                    </SettingsCheckBoxColumn>
                    <SettingsCheckBoxColumn>
                      <HoliCheckbox
                        disabled={globalPreferencesUpdating}
                        checked={globalPreferences.email}
                        aria-label={t('profile.settings.notifications.column.header.email')}
                        onSelect={toggleEmailPreference}
                      />
                    </SettingsCheckBoxColumn>
                  </HoliColumns>
                </>
              ) : (
                <HoliLoader />
              )}
            </HoliRoundedSection>
          </View>
        </LoginProtection>
      </ScrollHeaderLayout.Default>
    </PermissionsGuard>
  )
}

const SettingsCheckBoxColumn = ({ children }: React.PropsWithChildren) => {
  return (
    <HoliColumn padding={8} width={64} alignItems={'center'}>
      {children}
    </HoliColumn>
  )
}

const SettingsNameColumn = ({ children }: React.PropsWithChildren) => {
  return (
    <HoliColumn padding={[8, 16, 0, 0]} flex={1}>
      {children}
    </HoliColumn>
  )
}

const BellIllustration: React.FC<{ style: ViewStyle }> = (props) => (
  <View style={{ width: 32, ...props.style }}>
    <HoliLocalImage
      imageSource={require('@holi/ui/assets/img/illustrations/illustration_bell.svg')}
      width={32}
      height={32}
      resizeMode="contain"
      label=""
      isSvg
    />
  </View>
)

export default memo(NotificationSettings)

const styles = StyleSheet.create({
  accountSettings: {
    paddingHorizontal: 0,
  },
  settingsItem: {
    marginVertical: 24,
  },
  separator: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.background30,
    height: 1,
  },
  firstSectionWhiteSpace: { paddingTop: 40, paddingLeft: 24 },
  verticalSpacing: {
    paddingBottom: 8,
  },
})
