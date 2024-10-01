import React from 'react'

import NotificationWithUserAvatar from '@holi/core/screens/notifications/components/NotificationWithUserAvatar'
import { NotificationCommentReactions, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationCommentReactionItem: React.FC<NotificationProps<NotificationCommentReactions>> = ({
  notification,
  style,
  testID,
}) => {
  const { link } = notification.options.comment

  return <NotificationWithUserAvatar notification={notification} href={link} style={style} testID={testID} />
}

export default NotificationCommentReactionItem
