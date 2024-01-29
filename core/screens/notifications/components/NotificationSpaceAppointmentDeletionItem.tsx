import React from 'react'

import { NotificationSpaceAppointmentBaseItem } from '@holi/core/screens/notifications/components/NotificationSpaceAppointmentBaseItem'
import { NotificationAppointments, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationSpaceAppointmentDeletionItem = ({
  notification,
  testID = '',
}: NotificationProps<NotificationAppointments>) => {
  const link = `/spaces/${notification.options.space.name}`

  return <NotificationSpaceAppointmentBaseItem link={link} testID={testID} notification={notification} />
}

export default NotificationSpaceAppointmentDeletionItem
