import { useRouter } from "next/router";
import { useEffect } from "react";
import FeedItemDetailComponent from "shared/components/feed/FeedItemDetail";

export default function FeedItemDetail() {
  const router = useRouter();
  const postId = router.query.postId as string
  if (!postId) {
    return null;
  }
  return (
    <>
      <h1>Feed Item Detail</h1>
      {router.isReady ? <FeedItemDetailComponent postId={postId} /> : null}
    </>
  );
}
