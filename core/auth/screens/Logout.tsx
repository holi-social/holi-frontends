import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import client from '@holi/api/graphql/client'
import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { getSessionFromStorage, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import { displayError } from '@holi/core/errors/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>
const Logout: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const { navigateBack } = useRouting()
  const { setUserLoggedOut } = useContext(AuthContext)
  const { t } = useTranslation()

  useNavigationHeader(navigation, {
    title: '',
    headerLeft: () => (Platform.OS === 'web' ? <HoliText /> : <BackButton icon="arrow-left-s" />),
    headerRight: () => (Platform.OS === 'web' ? <BackButton icon="close" /> : <HoliText />),
  })

  const onSubmit = () => {
    getSessionFromStorage()
      .then((session) => submitLogoutFlow({ session_token: session ? session.session_token : '' }))
      .then(() => client.clearStore())
      .then(() => setUserLoggedOut())
      .then(() => {
        console.info('[Logout] logout successful')
        navigateBack()
      })
      .catch((e) => {
        console.warn('[Logout] logout failed, removing session from storage')
        setUserLoggedOut() // will remove session info from storage
        throw e // will be sent to Sentry so we're aware of it
        // not displaying an user-facing error messages as with the removal from the storage logout should be done
      })
      .catch((error) => displayError(error, t('auth.logout.error')))
  }
  return (
    <DefaultLayout>
      <View style={styles.container}>
        <HoliHeading level="1" size="small" style={{ fontWeight: 'normal' }}>
          {t('auth.logout.heading')}
        </HoliHeading>
        <HoliButton
          label={t('auth.logout.button')}
          onPress={() => onSubmit()}
          style={styles.button}
          testID="confirm-logout-button"
        >
          {t('auth.logout.button')}
        </HoliButton>
      </View>
    </DefaultLayout>
  )
}

export default Logout

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 34,
    minHeight: '100%',
    paddingTop: 60,
    alignItems: 'center',
  },
  button: {
    maxWidth: 300,
    marginTop: 30,
  },
})
