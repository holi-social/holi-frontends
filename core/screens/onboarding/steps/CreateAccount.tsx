import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import { Text } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/foundations/dimensions/spacing'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Authentication } from '@holi/core/screens/auth/components/Authentication'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

export interface CreateAccountProps {
  onRegister: () => void
  onLogin: () => void
  onContinueAsGuest: () => void
  flowId?: string
  testID?: string
}

export const CreateAccount = ({ onRegister, onLogin, onContinueAsGuest, flowId, testID }: CreateAccountProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.container} testID={testID}>
      <HeaderBackButton style={styles.backButton} />
      <View style={styles.logoContainer} testID="create-account-logo">
        <HoliLogo color={styles.logo.color} />
      </View>
      <Text headingLevel="1" size="4xl" textAlign="center" margin={{ bottom: 'xs' }}>
        {t('registration.signUp.heading')}

        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/icons/give-five-filled.svg')}
          width={50}
          height={40}
          label={''}
          isSvg
        />
      </Text>
      <Authentication
        flowId={flowId}
        initialTab="registration"
        onRegister={onRegister}
        onLogin={onLogin}
        onContinueAsGuest={onContinueAsGuest}
        testID={testID}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  logo: {
    color: theme.colors.fill.black,
  },
  container: {
    paddingVertical: Spacing.md,
  },
  backButton: {
    position: 'absolute',
    top: Spacing.md,
    left: 0,
    zIndex: 1000,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
}))
