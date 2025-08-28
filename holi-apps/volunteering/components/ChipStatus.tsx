import React from 'react'
import { View } from 'react-native'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { pill } from 'holi-bricks/components/chips/styles'
import { Text } from 'holi-bricks/components/text'
import type { Color, LayoutProps } from 'holi-bricks/foundations'
import { layoutStyle, Spacing } from 'holi-bricks/foundations'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { OneOfThree, TwoOfThree, CheckboxCircleFilled } from '@holi/icons/src/generated'
import type { FillColors } from 'holi-bricks/foundations/colors/themes/types'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { type ChipSize, chipSizeToTextSize } from 'holi-bricks/components/chips/size'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { StyleSheet } from 'react-native-unistyles'

export type ChipColor = Color | 'white'

export type ChipStatusProps = AccessibilityProps &
  LayoutProps & {
    status: VolunteeringOpportunityStatusValue
    size?: ChipSize
  }

type chipStatusColor = 'blue' | 'orange' | 'purple' | 'green'

const STATUS_MAP: Record<
  VolunteeringOpportunityStatusValue,
  { label: string; icon: HoliIconType; color: chipStatusColor; iconColor?: FillColors }
> = {
  [VolunteeringOpportunityStatusValue.WontDo]: { label: 'Planned', icon: OneOfThree, color: 'blue' }, // Dummy
  [VolunteeringOpportunityStatusValue.ToDo]: { label: 'Planned', icon: OneOfThree, color: 'blue' },
  [VolunteeringOpportunityStatusValue.Contacted]: { label: 'Contacted', icon: TwoOfThree, color: 'orange' },
  [VolunteeringOpportunityStatusValue.Doing]: {
    label: 'Helping',
    icon: CheckboxCircleFilled,
    color: 'green',
    iconColor: 'greenDark',
  },
  // Dummy
  [VolunteeringOpportunityStatusValue.Done]: {
    label: 'Done',
    icon: OneOfThree,
    color: 'purple',
    iconColor: 'purpleDark',
  },
}

export const ChipStatus = ({ status, size = 'md', ...rest }: ChipStatusProps) => {
  styles.useVariants({ size })
  const { label, icon, color, iconColor } = STATUS_MAP[status]

  return (
    <View {...accessibilityProps(rest)} style={[styles.chip(color), layoutStyle(rest)]}>
      <HoliIcon icon={icon} size={20} color={iconColor} />
      <Text size={chipSizeToTextSize[size]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  chip: (color: chipStatusColor) => ({
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
