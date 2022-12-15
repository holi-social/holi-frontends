import React from 'react'

import NotificationBaseItem from '@holi/core/screens/notifications/components/NotificationBaseItem'
import { NotificationPost, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationPostItem: React.VFC<NotificationProps<NotificationPost>> = ({ notification, style }) => {
  return <NotificationBaseItem notification={notification} i18nKey="notifications.post.mention.message" style={style} />
}

export default NotificationPostItem
