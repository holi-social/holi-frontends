import { useRouter } from "next/router";
import FeedComponent from "shared/components/feed/Feed"

export default function Feed() {
  const router = useRouter()
  return (
    <>
      <h1>Feed</h1>
      <FeedComponent onItemPressed={(post) => router.push(`/feed/${post.id}`)}/>
    </>
  );
}
