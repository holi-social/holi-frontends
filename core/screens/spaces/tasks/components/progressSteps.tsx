import type React from 'react'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { View } from 'react-native'
import { Check } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { BorderWidth } from 'holi-bricks/foundations/dimensions/borderWidth'

type Stage = 'todo' | 'inprogress' | 'done'
type Size = 'md' | 'lg'

type ProgressProps = {
  stage?: Stage
  size?: Size
}

type StepProps = ProgressProps & {
  content: React.ReactNode
}

type StepIconProps = ProgressProps & {
  icon: HoliIconType
}

type StepTextProps = ProgressProps & {
  value: number | string
}

export const Step = ({ content, stage = 'todo', size = 'md' }: StepProps) => {
  const { styles } = useStyles(stylesheet, { stage, size })

  return <View style={styles.step}>{content}</View>
}

export const StepIcon = ({ icon, stage, size }: StepIconProps) => (
  <Step content={<HoliIcon icon={icon} size={Spacing.xs} color="white" />} stage={stage} size={size} />
)

export const StepCheck = (props: ProgressProps) => <StepIcon icon={Check} {...props} />

export const StepText = ({ value, stage = 'todo', size }: StepTextProps) => (
  <Step
    content={
      <Text size="xs" color={stage === 'todo' ? 'purpleDefault' : 'white'}>
        {value}
      </Text>
    }
    stage={stage}
    size={size}
  />
)

const stylesheet = createStyleSheet((theme) => ({
  step: {
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      stage: {
        todo: {
          backgroundColor: theme.colors.bg.support,
          borderWidth: BorderWidth.sm,
          borderColor: theme.colors.border.purpleDefault,
        },
        inprogress: {
          backgroundColor: theme.colors.bg.purpleDark,
          borderWidth: BorderWidth.xl,
          borderColor: theme.colors.border.purpleDefault,
        },
        done: {
          backgroundColor: theme.colors.bg.purpleDefault,
        },
      },
      size: {
        md: {
          height: Spacing.md,
          width: Spacing.md,
        },
        lg: {
          height: Spacing.lg,
          width: Spacing.lg,
        },
      },
    },
  },
}))
