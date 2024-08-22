import { User } from '@holi/core/domain/shared/types'
import { Comment } from '@holi/core/screens/comments/types'

export const getPostCommenters = (comments: Comment[]) =>
  comments?.reduce(
    (acc, { creator }) => (acc.find((user) => user.id === creator.id) ? acc : [...acc, creator]),
    [] as User[]
  )

export const getPostUrl = (postId?: string, insightId?: string, spaceIdOrName?: string): string => {
  if (insightId) return `/insights/${insightId}/posts/${postId}`
  else if (spaceIdOrName) return `/spaces/${spaceIdOrName}/updates/${postId}`
  return `/posts/${postId}`
}
