import React from 'react'

import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface Props {
  label: string
  icon: HoliIconType
  showBell?: boolean
  onPress?: () => void
  color?: string | undefined
  testID?: string
}

export const HoliButtonBell = ({ label, icon, showBell = false, onPress, color, testID = 'bell-button' }: Props) => {
  return (
    <HoliButton label={label} inline testID={testID} transparent onPress={onPress}>
      <NotificationBellBadge visible={showBell} testID={testID}>
        <HoliIcon icon={icon} color={color} />
      </NotificationBellBadge>
    </HoliButton>
  )
}
