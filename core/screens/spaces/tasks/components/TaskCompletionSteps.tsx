import type React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Spacing } from 'holi-bricks/foundations'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HeartHandshake2 } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { memo } from 'react'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { StepCheck, StepText } from './progressSteps'

export const TaskCompletionSteps = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const steps = [
    { number: 1, subtitle: t('tasks.register.unlogged.progress.step1') },
    { number: 2, subtitle: t('tasks.register.unlogged.progress.step2') },
    { number: 3, subtitle: t('tasks.register.unlogged.progress.step3') },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Connecting Lines - positioned absolutely to touch circles */}
        {steps.map((_, index) => {
          if (index < steps.length - 1) {
            return (
              <View
                key={`line-${index}`}
                style={[
                  styles.stepLine,
                  {
                    left: `${(100 / steps.length) * (index + 0.5)}%`,
                    width: `${100 / steps.length}%`,
                  },
                ]}
              />
            )
          }
          return null
        })}

        {steps.map((step, index) => (
          <View style={styles.stepContainer} key={`step-${index}`}>
            {/* Step Circle */}
            {step.number === 1 && <StepCheck stage="done" />}
            {step.number === 2 && <StepText value={step.number} stage="inprogress" size="lg" />}

            {step.number === 3 && (
              <View style={styles.step}>
                <HoliIcon icon={HeartHandshake2} size={24} color="purpleDefault" />
              </View>
            )}
            {/* Subtitle */}
            <Text size="sm" color="purpleDark" textAlign="center" margin={{ top: '3xs' }}>
              {step.subtitle}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: theme.colors.border.purpleDefault,
    top: Spacing.xs,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  step: {
    width: Spacing.lg,
    height: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export default memo(TaskCompletionSteps)
