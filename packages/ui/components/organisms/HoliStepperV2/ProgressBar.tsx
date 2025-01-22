import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { HoliProgressBar, useProgressBarAnimation } from '@holi/ui/components/molecules/HoliProgressBar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { Spacing } from 'holi-bricks/tokens'
import { Text } from 'holi-bricks/components/text'

export const PROGRESS_BAR_HEIGHT = 43

interface OnboardingHeaderProps {
  currentStep: number
  totalCount: number
  onSkipPress?: () => void
  testID?: string
}

export const ProgressBar = ({
  currentStep,
  totalCount,
  onSkipPress,
  testID = 'progress-bar',
}: OnboardingHeaderProps) => {
  const { t } = useTranslation()
  const { percentage } = useProgressBarAnimation((currentStep / totalCount) * 100)

  return (
    <View testID={testID} style={{ height: PROGRESS_BAR_HEIGHT }}>
      <HoliProgressBar percentage={percentage} />

      <View style={styles.stepCounter}>
        <Text size="xs" color="support">
          {t('wizard.stepsCount', { current: currentStep + 1, total: totalCount })}
        </Text>

        <HoliTransition.Fade visible={!!onSkipPress}>
          <HoliButton
            label={t('global.skip')}
            inline
            transparent
            variant="small"
            onPress={onSkipPress}
            testID={`${testID}-skip-btn`}
          >
            <Text size="xs" color="support">
              {t('global.skip')}
            </Text>
          </HoliButton>
        </HoliTransition.Fade>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  stepCounter: {
    marginTop: Spacing.xxs,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
