import React from 'react'

import HoliIconBadge from '@holi/core/navigation/components/header/HoliIconBadge'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface Props {
  label: string
  icon: HoliIconType
  showBadge?: boolean
  onPress?: () => void
  color?: string | undefined
  testID?: string
}

export const HoliButtonBell = ({
  label,
  icon,
  showBadge = false,
  onPress,
  color,
  testID = showBadge ? 'bell-button-with-icon' : 'bell-button',
}: Props) => {
  return (
    <HoliButton label={label} inline testID={showBadge ? testID + '-with-badge' : testID} transparent onPress={onPress}>
      <HoliIconBadge showBadge={showBadge}>
        <HoliIcon icon={icon} color={color} />
      </HoliIconBadge>
    </HoliButton>
  )
}
