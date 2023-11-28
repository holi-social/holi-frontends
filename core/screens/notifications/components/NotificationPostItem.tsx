import React from 'react'

import NotificationSpaceItem from '@holi/core/screens/notifications/components/NotificationSpaceItem'
import { NotificationPost, NotificationProps } from '@holi/core/screens/notifications/components/types'

const NotificationPostCommentItem: React.VFC<NotificationProps<NotificationPost>> = ({
  notification,
  style,
  testID,
}) => {
  const {
    post: { id: postId },
  } = notification.options

  return <NotificationSpaceItem notification={notification} href={`/posts/${postId}`} style={style} testID={testID} />
}

export default NotificationPostCommentItem
