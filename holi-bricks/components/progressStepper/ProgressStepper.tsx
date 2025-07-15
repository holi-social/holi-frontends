import React from 'react'
import { Check } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/foundations'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { View } from 'react-native'

export type StepStatus = 'upcoming' | 'active' | 'done'

interface ProgressStepperProps {
  step: number
  label?: string
  status: StepStatus
  isLast?: boolean
  isFirst?: boolean
}

export const ProgressStepper = ({ step, label, status, isLast = false, isFirst = false }: ProgressStepperProps) => {
  const { styles } = useStyles(stylesheet)
  const isCompleted = status === 'done'
  const isActive = status === 'active'

  return (
    <Stack alignItems="center" gap="3xs">
      <Stack direction="row" alignItems="center">
        {/* Line from previous step */}
        <View style={styles.line(isFirst)} />

        {/* Step Circle */}
        <Stack
          padding={isActive ? '4xs' : undefined}
          width={28}
          height={28}
          borderRadius="pill"
          justifyContent="center"
          alignItems="center"
          backgroundColor={isActive ? 'purpleDefault' : undefined}
        >
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
            {isCompleted ? (
              <HoliIcon icon={Check} size={16} color={isActive || isCompleted ? 'selected' : 'informative'} />
            ) : (
              <Text size="xs" color={isActive || isCompleted ? 'selected' : 'informative'}>
                {step}
              </Text>
            )}
          </Stack>
        </Stack>

        {/* Line to next step */}
        <View style={styles.line(isLast)} />
      </Stack>

      {/* Label */}
      <Text size="xs" color="informative">
        {label}
      </Text>
    </Stack>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  line: (hide: boolean) => ({
    width: Spacing.lg,
    height: hide ? 0 : 2,
    backgroundColor: theme.colors.decorative.purpleDefault,
  }),
}))
