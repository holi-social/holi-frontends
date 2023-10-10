import React from 'react'

import { useNotificationContext } from './Notifications2Provider'

export const Notifications2: React.FC<React.PropsWithChildren> = () => {
  const notificationContext = useNotificationContext()

  if (notificationContext?.notifications.length === 0) return <div>No notifications</div>

  return (
    <div>
      {notificationContext?.notifications.map((notification) => (
        <div key={notification._notificationId}>
          <div>{notification.createdAt.toString()}</div>
          <div>{notification.content.toString()}</div>
          <details>
            <small>{JSON.stringify(notification, null, 2)}</small>
          </details>
        </div>
      ))}
    </div>
  )
}
