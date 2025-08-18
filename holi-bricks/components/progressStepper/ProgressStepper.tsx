import type React from 'react'
import { Check } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/foundations'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Easing, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  interpolate,
  Extrapolation,
  useSharedValue,
} from 'react-native-reanimated'
// eslint-disable-next-line no-restricted-imports
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'

export interface ProgressStepperStep<T extends string = string> {
  key: T
  label: string
  icon?: {
    inactive: HoliIconType
    active: HoliIconType
  }
}

interface ProgressStepperProps<T extends string = string> {
  steps: ProgressStepperStep<T>[]
  activeStepKey: T
}

export const ProgressStepper = <T extends string = string>({ steps, activeStepKey }: ProgressStepperProps<T>) => {
  const { styles } = useStyles(stylesheet)
  const activeStepIndex = steps.findIndex((step) => step.key === activeStepKey)

  const animatedLineWidth = useSharedValue(0)
  const anim = useDerivedValue(() => {
    const percentage = (activeStepIndex / (steps.length - 1)) * 100
    return interpolate(percentage, [0, 100], [0, animatedLineWidth.value], Extrapolation.CLAMP)
  }, [activeStepIndex, steps.length])

  const animationActivePile = useAnimatedStyle(() => ({
    left: withTiming(anim.value, { duration: 400, easing: Easing.elastic(0.5) }),
  }))

  return (
    <Stack direction="row" justifyContent="space-between" flex={1}>
      <View
        style={styles.line}
        onLayout={(event) => {
          animatedLineWidth.value = event.nativeEvent.layout.width
        }}
      >
        <Animated.View style={[styles.activeStepIndicator, animationActivePile]} />
      </View>

      {steps.map(({ key, label, icon }, index) => {
        const isCompleted = index < activeStepIndex
        const isActive = index === activeStepIndex

        return (
          <Stack alignItems="center" gap="3xs" key={key} flexBasis={Spacing['4xl']}>
            <Stack direction="row" alignItems="center">
              {icon ? (
                <HoliTransition.FadeSwitch animKey={isActive ? 'active' : 'inactive'}>
                  {isActive ? (
                    <HoliIcon icon={icon.active} size={Spacing.md} />
                  ) : (
                    <HoliIcon icon={icon.inactive} size={Spacing.md} />
                  )}
                </HoliTransition.FadeSwitch>
              ) : (
                <Stack
                  width={Spacing.md}
                  height={Spacing.md}
                  borderRadius="pill"
                  borderWidth="sm"
                  borderColor="purpleDefault"
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor={isActive ? 'purpleDark' : isCompleted ? 'purpleDefault' : 'support'}
                >
                  <HoliTransition.FadeSwitch animKey={isCompleted ? 'done' : 'undone'}>
                    {isCompleted ? (
                      <HoliIcon
                        icon={Check}
                        size={Spacing.xs}
                        color={isActive || isCompleted ? 'selected' : 'informative'}
                      />
                    ) : (
                      <Text size="xs" color={isActive || isCompleted ? 'selected' : 'informative'}>
                        {index + 1}
                      </Text>
                    )}
                  </HoliTransition.FadeSwitch>
                </Stack>
              )}
            </Stack>

            {/* Label */}
            <Text size="xs" color="informative">
              {label}
            </Text>
          </Stack>
        )
      })}
    </Stack>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  line: {
    height: 2,
    backgroundColor: theme.colors.decorative.purpleDefault,
    position: 'absolute',
    top: Spacing.xxs,
    left: Spacing['4xl'] / 2,
    right: Spacing['4xl'] / 2,
  },
  activeStepIndicator: {
    width: Spacing.lg,
    height: Spacing.lg,
    backgroundColor: theme.colors.decorative.purpleDefault,
    borderRadius: '50%',
    transform: [{ translateX: -Spacing.lg / 2 }, { translateY: -Spacing.lg / 2 }],
  },
}))
