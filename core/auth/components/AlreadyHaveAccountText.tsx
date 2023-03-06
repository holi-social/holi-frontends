import React from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import { colors } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

export interface AlreadyHaveAccountTextProps {
  withReplacing?: boolean
  style?: StyleProp<ViewStyle>
}

const AlreadyHaveAccountText: React.VFC<AlreadyHaveAccountTextProps> = ({ withReplacing = false, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { navigate, navigateBack, replaceRoute } = useRouting()

  return (
    <HoliText size="small" style={style}>
      <Trans t={t} i18nKey={'auth.registration.alreadyHasAccount'}>
        <HoliLink
          label={t('auth.login')}
          href={'/login'}
          onPress={
            withReplacing
              ? () => {
                  if (Platform.OS === 'web') {
                    replaceRoute('/login')
                  } else {
                    navigateBack()
                    setTimeout(() => navigate('/login'), 300) // use timeout to open new modal after previous was closed
                  }

                  return false
                }
              : undefined
          }
          textStyle={[styles.link, { fontFamily: theme.fontFamily.default('Medium') }]}
          testID="btn-to-login-form"
        />
      </Trans>
    </HoliText>
  )
}

const styles = StyleSheet.create({
  link: {
    fontSize: 14,
    lineHeight: 14 * 1.2,
    fontWeight: '700',
    color: colors.foreground30,
  },
})

export default AlreadyHaveAccountText
