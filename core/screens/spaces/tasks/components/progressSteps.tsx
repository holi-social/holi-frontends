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

type ProgressProps = {
  stage?: Stage
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

export const Step = ({ content, stage = 'todo' }: StepProps) => {
  const { styles } = useStyles(stylesheet, { stage })

  return <View style={styles.step}>{content}</View>
}

export const StepIcon = ({ icon, stage }: StepIconProps) => (
  <Step content={<HoliIcon icon={icon} size={Spacing.sm} color="white" />} stage={stage} />
)

export const StepCheck = ({ stage }: ProgressProps) => <StepIcon icon={Check} stage={stage} />

export const StepText = ({ value, stage = 'todo' }: StepTextProps) => (
  <Step
    content={
      <Text size="md" color={stage === 'todo' ? 'purpleDefault' : 'white'}>
        {value}
      </Text>
    }
    stage={stage}
  />
)

const stylesheet = createStyleSheet((theme) => ({
  step: {
    height: Spacing.lg,
    width: Spacing.lg,
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
          outlineStyle: 'solid',
          outlineWidth: 6,
          outlineColor: theme.colors.border.purpleDefault,
        },
        done: {
          backgroundColor: theme.colors.bg.purpleDefault,
        },
      },
    },
  },
}))
