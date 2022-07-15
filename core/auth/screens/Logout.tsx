import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { getSessionFromStorage, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { useNavigationContext } from '@holi/core/navigation/context'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'

const Logout: React.VoidFunctionComponent = () => {
  const { navigateBack } = useRouting()
  const { setUserLoggedOut } = useContext(AuthContext)
  const { setBackLink, clearBackLinks } = useNavigationContext()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  useEffect(() => {
    setBackLink('down')
    return () => clearBackLinks()
  }, [])

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
        <HoliButton label={t('auth.logout.button')} onPress={() => onSubmit()} style={styles.button}>
          {t('auth.logout.button')}
        </HoliButton>
      </View>
    </DefaultLayout>
  )
}

export { Logout }

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
