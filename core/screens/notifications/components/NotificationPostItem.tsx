import React from 'react'

import NotificationWithUserAvatar from '@holi/core/screens/notifications/components/NotificationWithUserAvatar'
import { NotificationPost, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationPostItem: React.FC<NotificationProps<NotificationPost>> = ({ notification, style, testID }) => {
  const {
    comment: { id: commentId },
    post: { id: postId },
    commentLink,
  } = notification.options

  const link = commentLink ? commentLink : `/posts/${postId}?commentId=${commentId}`

  return <NotificationWithUserAvatar notification={notification} href={link} style={style} testID={testID} />
}

export default NotificationPostItem
