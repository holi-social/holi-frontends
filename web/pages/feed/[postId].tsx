import React from 'react'
import { useRouter } from 'next/router'
import FeedItemDetailComponent from 'shared/components/feed/FeedItemDetail'

const FeedItemDetail: React.VoidFunctionComponent = () => {
  const router = useRouter()
  const postId = router.query.postId as string
  if (!postId) {
    return null
  }
  return (
    <>
      <h1>Feed Item Detail</h1>
      {router.isReady ? <FeedItemDetailComponent postId={postId} /> : null}
    </>
  )
}

export default FeedItemDetail
