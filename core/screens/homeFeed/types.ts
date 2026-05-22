import type { GoodNewsArticle } from '@holi-apps/goodnews/types'
import type { FeedPost } from '@holi/core/screens/individualPosts/types'
import type { Post } from '@holi/core/screens/posts/types'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

export interface FeedItem {
  post?: Post
  feedPost?: FeedPost | Post
  spacePost?: FeedPost | Post
}

export type CombinedFeedItem = FeedItem & {
  goodNewsArticle?: GoodNewsArticle
  volunteeringReco?: LocalizedTypesenseDocument
}
