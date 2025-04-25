import type React from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import type { ErrorContext } from '@holi/core/errors/helpers/logError.shared'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Text } from 'holi-bricks/components/text'

export interface OAuth2RedirectProps {
  error?: string
  errorContext?: ErrorContext
}

export const OAuth2Redirect = ({ error, errorContext }: OAuth2RedirectProps) => {
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
        <Text size="md">{error ? t('oauth2.redirect.error') : t('oauth2.redirecting')}</Text>
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: dimensions.topBarHeight + 50,
  },
})
