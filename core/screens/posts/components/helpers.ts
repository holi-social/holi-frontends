import { Comment } from '@holi/core/screens/posts/types'
import { User } from '@holi/core/screens/userprofile/types'

export const getPostCommenters = (comments: Comment[]) =>
  comments?.reduce(
    (acc, { creator }) => (acc.find((user) => user.id === creator.id) ? acc : [...acc, creator]),
    [] as User[]
  )
