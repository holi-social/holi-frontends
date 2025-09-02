import { StyleSheet, View } from 'react-native'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useTranslation } from 'react-i18next'
import { Spacing } from 'holi-bricks/foundations'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, HeartHandshake2 } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { memo } from 'react'

export const TaskCompletionSteps = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const styles = getStyles(theme)

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
            {step.number === 1 && (
              <View style={styles.step}>
                <View style={styles.stepCircle}>
                  <HoliIcon icon={Check} size={Spacing.sm} color="white" />
                </View>
              </View>
            )}

            {step.number === 2 && (
              <View style={[styles.step, styles.borderedStep]}>
                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                  <Text size="md" color="white">
                    {step.number}
                  </Text>
                </View>
              </View>
            )}

            {step.number === 3 && (
              <View style={{}}>
                <View style={styles.step}>
                  <View style={[styles.stepCircle, styles.stepCircleIcon]}>
                    <HoliIcon icon={HeartHandshake2} size={36} color="purpleDefault" />
                  </View>
                </View>
              </View>
            )}
            {/* Subtitle */}
            <Text size="sm" color="purpleDark" textAlign="center">
              {step.subtitle}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.xs,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
    },
    stepLine: {
      position: 'absolute',
      height: 2,
      backgroundColor: theme.colors.brandB200,
      top: Spacing.sm,
    },
    stepContainer: { flex: 1, alignItems: 'center' },
    step: {
      borderRadius: Spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing['3xs'],
      borderWidth: 6,
      borderColor: 'transparent',
    },
    borderedStep: {
      borderColor: theme.colors.brandB200,
    },
    stepCircle: {
      width: Spacing.lg,
      backgroundColor: theme.colors.brandB200,
      height: Spacing.lg,
      borderRadius: Spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepCircleActive: {
      backgroundColor: theme.colors.brandB300,
    },
    stepCircleIcon: {
      backgroundColor: 'transparent',
    },
  })

export default memo(TaskCompletionSteps)
