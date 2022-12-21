import React from 'react'

import NotificationWithUserAvatar from '@holi/core/screens/notifications/components/NotificationWithUserAvatar'
import { NotificationPost, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationPostItem: React.VFC<NotificationProps<NotificationPost>> = ({ notification, style }) => {
  const {
    id: commentId,
    post: { id: postId },
  } = notification.options.postComment

  return (
    <NotificationWithUserAvatar
      notification={notification}
      i18nKey="notifications.post.mention.message"
      href={`/posts/${postId}?commentId=${commentId}`}
      style={style}
    />
  )
}

export default NotificationPostItem
