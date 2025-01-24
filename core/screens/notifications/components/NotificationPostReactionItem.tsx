import type React from 'react'

import NotificationWithUserAvatar from '@holi/core/screens/notifications/components/NotificationWithUserAvatar'
import type { NotificationPostReactions, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationPostReactionItem: React.FC<NotificationProps<NotificationPostReactions>> = ({
  notification,
  style,
  testID,
}) => {
  const { link } = notification.options.post

  return <NotificationWithUserAvatar notification={notification} href={link} style={style} testID={testID} />
}

export default NotificationPostReactionItem
