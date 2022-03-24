import React from 'react'
import { useRouter } from 'next/router'
import FeedItemDetail from 'shared/features/community/components/feed/FeedItemDetail'

const FeedItemDetailPage: React.VoidFunctionComponent = () => {
  const router = useRouter()
  const postId = router.query.postId as string
  if (!postId) {
    return null
  }
  return (
    <>
      <h1>Feed Item Detail</h1>
      {router.isReady ? <FeedItemDetail postId={postId} /> : null}
    </>
  )
}

export default FeedItemDetailPage
