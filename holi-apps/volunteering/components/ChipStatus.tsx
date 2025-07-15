import React from 'react'
import { View } from 'react-native'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { pill } from 'holi-bricks/components/chips/styles'
import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import type { Color, LayoutProps } from 'holi-bricks/foundations'
import { layoutStyle, Spacing } from 'holi-bricks/foundations'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { OneOfThree, TwoOfThree, ThreeOfThree, CheckboxCircleFilled } from '@holi/icons/src/generated'
import type { VolunteeringEngagementStatus } from '@holi/core/layout/DetailsScreen'
import type { FillColors } from 'holi-bricks/foundations/colors/themes/types'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { type ChipSize, chipSizeToTextSize } from 'holi-bricks/components/chips/size'

export type ChipColor = Color | 'white'

export type ChipStatusProps = AccessibilityProps &
  LayoutProps & {
    status: VolunteeringEngagementStatus
    size?: ChipSize
  }

const STATUS_MAP: Record<
  VolunteeringEngagementStatus,
  { label: string; icon: HoliIconType; color: 'blue' | 'orange' | 'purple' | 'green'; iconColor?: FillColors }
> = {
  planned: { label: 'Planned', icon: OneOfThree, color: 'blue' },
  contacted: { label: 'Contacted', icon: TwoOfThree, color: 'orange' },
  doing: { label: 'Doing', icon: ThreeOfThree, color: 'purple' },
  done: { label: 'Done', icon: CheckboxCircleFilled, color: 'green', iconColor: 'greenDark' },
}

export const ChipStatus = ({ status, size = 'md', ...rest }: ChipStatusProps) => {
  const { styles } = useStyles(stylesheet, { size })
  const { label, icon, color, iconColor } = STATUS_MAP[status]

  return (
    <View {...accessibilityProps(rest)} style={[styles.chip(color), layoutStyle(rest)]}>
      <HoliIcon icon={icon} size={20} color={iconColor} />
      <Text size={chipSizeToTextSize[size]}>{label}</Text>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  chip: (color: 'blue' | 'orange' | 'purple' | 'green') => ({
    ...pill,
    backgroundColor: theme.colors.decorative[`${color}Light`],
    borderColor: theme.colors.decorative[`${color}Dark`],
    borderWidth: 1,
    alignSelf: 'flex-start',
    variants: {
      size: {
        sm: {
          paddingHorizontal: Spacing['3xs'],
          minHeight: Spacing.md,
        },
        md: {
          paddingHorizontal: Spacing['3xs'],
          minHeight: Spacing.lg,
        },
        lg: {
          paddingHorizontal: 10,
          minHeight: Spacing.xl,
        },
      },
    },
  }),
}))
