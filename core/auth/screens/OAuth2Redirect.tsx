import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { ErrorContext } from '@holi/core/errors/helpers/logError.shared'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface OAuth2RedirectProps {
  error?: string
  errorContext?: ErrorContext
}

const OAuth2Redirect: React.VFC<OAuth2RedirectProps> = ({ error, errorContext }) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()

  useEffect(() => {
    if (error) {
      displayError(new HoliError(error), 'Error during OAuth2 flow', {
        // Only fallback location, should ideally be overwritten
        location: 'OAuth2Redirect.useEffect',
        ...errorContext,
      })
    }
  }, [displayError, error, errorContext])

  return (
    <DefaultLayout>
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{error ? t('oauth2.redirect.error') : t('oauth2.redirecting')}</HoliText>
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: vars.topBarHeight + 50,
  },
})

export default OAuth2Redirect
