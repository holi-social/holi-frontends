import { useRouter } from "next/router";
import FeedComponent from "shared/components/Feed"

export default function Feed() {
  const router = useRouter()
  return (
    <>
      <h1>Feed</h1>
      <FeedComponent onPress={(post) => router.push(`/feed/${post.id}`)}/>
    </>
  );
}
