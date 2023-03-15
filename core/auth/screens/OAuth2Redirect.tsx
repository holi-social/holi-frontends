import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface Oauth2RedirectProps {
  error?: string
}

const OAuth2Redirect: React.VFC<Oauth2RedirectProps> = ({ error }) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()

  if (error) {
    displayError(new Error(error))
  }

  return (
    <DefaultLayout>
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('oauth2.redirecting')}</HoliText>
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
