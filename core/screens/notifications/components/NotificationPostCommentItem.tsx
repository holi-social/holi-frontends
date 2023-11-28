import React from 'react'

import NotificationWithUserAvatar from '@holi/core/screens/notifications/components/NotificationWithUserAvatar'
import { NotificationPostComment, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationPostCommentItem: React.VFC<NotificationProps<NotificationPostComment>> = ({
  notification,
  style,
  testID,
}) => {
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

export default NotificationPostCommentItem
