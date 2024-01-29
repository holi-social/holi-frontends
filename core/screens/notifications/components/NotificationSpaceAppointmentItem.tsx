import React from 'react'

import { NotificationSpaceAppointmentBaseItem } from '@holi/core/screens/notifications/components/NotificationSpaceAppointmentBaseItem'
import { NotificationAppointments, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationSpaceAppointmentItem = ({
  notification,
  testID = '',
}: NotificationProps<NotificationAppointments>) => {
  const {
    options: {
      space: { name: spaceName },
      appointment: { id: appointmentId },
    },
  } = notification

  const appointmentUrl = `/spaces/${spaceName}/appointments/${appointmentId}`
  const spaceUrl = `/spaces/${spaceName}`
  const link = appointmentId ? appointmentUrl : spaceUrl

  return <NotificationSpaceAppointmentBaseItem link={link} testID={testID} notification={notification} />
}

export default NotificationSpaceAppointmentItem
