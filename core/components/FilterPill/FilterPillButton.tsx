import React from 'react'
import type { GestureResponderEvent } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { PropsWithSkeleton } from '@holi/ui/components/types'

import { type BasePillProps, FilterPill } from './FilterPill'

interface BasePillButtonProps extends BasePillProps {
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
  testID?: string
}

export const FilterPillButton: React.FC<PropsWithSkeleton<BasePillButtonProps>> = ({
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
