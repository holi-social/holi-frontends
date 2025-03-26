import React from 'react'

import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ButtonIcon } from 'holi-bricks/components/button'
import type { TrackingEvent } from '@holi/core/tracking'
import { ButtonIconTracked } from '@holi/core/components/Trackable'

interface Props {
  label: string
  icon: HoliIconType
  showBell?: boolean
  onPress?: () => void
  testID?: string
  trackingEvent?: TrackingEvent
}

export const HoliButtonBell = ({
  label,
  icon,
  showBell = false,
  onPress,
  testID = 'bell-button',
  trackingEvent,
}: Props) => {
  return (
    <NotificationBellBadge visible={showBell} testID={testID}>
      {trackingEvent ? (
        <ButtonIconTracked
          label={label}
          testID={testID}
          transparent
          onPress={onPress}
          icon={icon}
          size="lg"
          trackingEvent={trackingEvent}
        />
      ) : (
        <ButtonIcon label={label} testID={testID} transparent onPress={onPress} icon={icon} size="lg" />
      )}
    </NotificationBellBadge>
  )
}
