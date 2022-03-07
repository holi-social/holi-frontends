import { useRouter } from "next/router";

export default function FeedItemDetail() {
  const router = useRouter();
  const { postId } = router.query;
  return (
    <>
      <h1>Feed Item Detail</h1>
      {postId}
    </>
  );
}
