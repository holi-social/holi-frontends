import React, { useContext, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { LoginProtection } from '@holi/core/auth/components/LoginProtection'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import LoggedOutView from '@holi/core/profile/LoggedOutView'
import { UserContext } from '@holi/core/user/UserContextProvider'
import { UserProfileForm } from '@holi/core/user/components/UserProfileForm'
import { UserProfileView } from '@holi/core/user/components/UserProfileView'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliChip from '@holi/ui/components/HoliChip'
import HoliChipRow from '@holi/ui/components/HoliChipRow'
import HoliTabs from '@holi/ui/components/HoliTabs'
import HoliText from '@holi/ui/components/HoliText'

export const UserProfileScreen: React.VFC = () => {
  const { navigate } = useRouting()
  const [editing, setEditing] = useState(false)
  const [chipChecked, setChipChecked] = useState(false)
  const toggleEditing = () => setEditing(!editing)
  const { t } = useTranslation()

  const { isLoggedIn } = useContext(AuthContext)
  const { user } = useContext(UserContext)

  const { setNavigationHeader } = useNavigationHeader()

  useLayoutEffect(() => {
    const profileTitle = isLoggedIn && user ? user.firstName : t('profile.title')
    setNavigationHeader({
      title: profileTitle,
      titleElement: () => <HoliText style={{ paddingTop: 5 }}>{profileTitle}</HoliText>,
    })
  }, [isLoggedIn])

  return (
    <DefaultLayout>
      <View style={styles.container}>
        <LoginProtection loggedOutContent={<LoggedOutView />}>
          <>
            {editing ? (
              <UserProfileForm onCancel={toggleEditing} onSubmit={toggleEditing} />
            ) : (
              <>
                <UserProfileView />
                <HoliButton label={t('profile.edit')} inline onPress={() => toggleEditing()}>
                  {t('profile.edit')}
                </HoliButton>
              </>
            )}
            <View style={{ marginVertical: 10 }}>
              <HoliChip
                label={t('profile.exampleInterest')}
                onPress={() => setChipChecked(!chipChecked)}
                checked={chipChecked}
                text={t('profile.exampleInterest')}
              />
            </View>
            <HoliButton label={t('profile.logout')} inline onPress={() => navigate('/logout')} testID="logout-button">
              {t('profile.logout')}
            </HoliButton>
          </>
        </LoginProtection>
      </View>
      <View style={{ marginTop: 24, marginHorizontal: Platform.OS === 'web' ? 24 : 0 }}>
        <HoliTabs
          tabs={[
            {
              title: t('profile.tabs.profile'),
              children: (
                <HoliChipRow editable title={t('profile.tabs.profile.engagementLevel')}>
                  {user?.engagementLevel && (
                    <HoliChip text={t('profile.tabs.profile.engagementLevel')} disabled></HoliChip>
                  )}
                  {!user?.engagementLevel && <HoliChip text={t('profile.tabs.profile.engagementLevel')}></HoliChip>}
                </HoliChipRow>
              ),
            },
            {
              title: t('profile.tabs.profile'),
              children: (
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 56,
                    paddingVertical: 72,
                  }}
                >
                  <HoliText style={{ textAlign: 'center' }}>{t('profile.tabs.profile.empty')}</HoliText>
                </View>
              ),
            },
            {
              title: t('profile.tabs.topics'),
              children: (
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 56,
                    paddingVertical: 72,
                  }}
                >
                  <HoliText style={{ textAlign: 'center' }}>{t('profile.tabs.topics.empty')}</HoliText>
                </View>
              ),
            },
          ]}
        ></HoliTabs>
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'baseline',
    marginHorizontal: 24,
  },
})
