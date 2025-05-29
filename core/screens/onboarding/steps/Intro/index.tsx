import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Stack } from 'holi-bricks/components/stack'
import { Spacing } from 'holi-bricks/foundations'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import { TrackingEvent } from '@holi/core/tracking/events'

import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import { Button } from 'holi-bricks/components/button'
import AnimatedIntro from './AnimatedIntro'

interface Props {
  onContinue: () => void
}

export const Intro = ({ onContinue }: Props) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  usePreventBackNavigation(true)

  return (
    <Stack flex={1} justifyContent="space-between">
      <Stack alignItems="center">
        <AnimatedIntro />
        <View style={styles.ctasContainer}>
          <Button label={t('onboarding.welcome.forward')} size="lg" onPress={onContinue} testID="btn-to-onboarding" />
          <AlreadyHaveAccountText trackingEvent={TrackingEvent.Auth.LoginButtonPressed} />
        </View>
      </Stack>

      <DocumentsFooter displayImprint={true} />
    </Stack>
  )
}

const stylesheet = createStyleSheet({
  ctasContainer: {
    width: '100%',
    maxWidth: 600,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: { xs: Spacing.xs, md: Spacing.lg },
    marginBottom: Spacing.xl,
    gap: {
      xs: Spacing.xs,
      md: Spacing.md,
    },
  },
})
