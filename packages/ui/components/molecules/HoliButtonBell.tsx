import React from 'react'

import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ButtonIcon } from 'holi-bricks/components/button'

interface Props {
  label: string
  icon: HoliIconType
  showBell?: boolean
  onPress?: () => void
  testID?: string
}

export const HoliButtonBell = ({ label, icon, showBell = false, onPress, testID = 'bell-button' }: Props) => {
  return (
    <NotificationBellBadge visible={showBell} testID={testID}>
      <ButtonIcon label={label} testID={testID} transparent onPress={onPress} icon={icon} size="lg" />
    </NotificationBellBadge>
  )
}
