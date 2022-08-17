import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { getSessionFromStorage, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import { displayError } from '@holi/core/errors/helpers'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const Logout: React.VoidFunctionComponent = () => {
  const { navigateBack } = useRouting()
  const { setUserLoggedOut } = useContext(AuthContext)
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()

  useEffect(
    () => {
      setNavigationHeader({
        headerLeft: () => <BackButton icon="arrowtip-down" />,
      })
      return clearNavigationHeader
    },
    // setNavigationHeader would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const onSubmit = () => {
    getSessionFromStorage()
      .then((session) => submitLogoutFlow({ session_token: session ? session.session_token : '' }))
      .then(() => {
        setUserLoggedOut().then(() => {
          console.info('[Logout] logout successful')
          navigateBack()
        })
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
        <HoliText>{t('auth.logout.heading')}</HoliText>
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
