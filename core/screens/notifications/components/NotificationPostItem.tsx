import React from 'react'

import NotificationWithUserAvatar from '@holi/core/screens/notifications/components/NotificationWithUserAvatar'
import { NotificationPost, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationPostItem: React.VFC<NotificationProps<NotificationPost>> = ({ notification, style, testID }) => {
  const {
    comment: { id: commentId },
    post: { id: postId },
  } = notification.options

  return (
    <NotificationWithUserAvatar
      notification={notification}
      href={`/posts/${postId}?commentId=${commentId}`}
      style={style}
      testID={testID}
    />
  )
}

export default NotificationPostItem
