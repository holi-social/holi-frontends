import type { FeedPost } from '@holi/core/screens/individualPosts/types'
import type { Insight } from '@holi/core/screens/insights/types'
import type { Post } from '@holi/core/screens/posts/types'

export interface FeedItem {
  post?: Post
  feedPost?: FeedPost | Post
  spacePost?: FeedPost | Post
  insight?: Insight
}
