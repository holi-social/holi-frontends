import React from 'react'
import type { GestureResponderEvent } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'

import { type BasePillProps, FilterPill } from './FilterPill'

interface BasePillButtonProps extends BasePillProps {
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
  testID?: string
}

interface SkeletonProps extends Partial<BasePillButtonProps> {
  loading: true
}

interface PillButtonProps extends BasePillButtonProps {
  loading?: false
}

export type FilterPillButtonProps = SkeletonProps | PillButtonProps

export const FilterPillButton: React.FC<FilterPillButtonProps> = ({
  label = '',
  onPress,
  testID = 'spaces-filter-pill',
  ...props
}) => {
  return (
    <HoliButton label={label} transparent inline onPress={onPress} testID={testID}>
      <FilterPill label={label} {...props} />
    </HoliButton>
  )
}
