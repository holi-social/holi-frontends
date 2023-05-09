import React from 'react'
import type { SyntheticEvent } from 'react'
import type { GestureResponderEvent } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import HoliBox from '@holi/ui/components/atoms/HoliBox'

interface Props {
  label: string
  onPress: (event: SyntheticEvent<Element, Event> | GestureResponderEvent) => void
}

export const Edit = ({ label, onPress }: Props) => {
  return (
    <HoliBox padding={[0, 0, 32, 0]}>
      <MoreOptionItem icon="edit-2" label={label} onPress={onPress} />
    </HoliBox>
  )
}
