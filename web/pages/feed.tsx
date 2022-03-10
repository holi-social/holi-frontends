import { NextPage } from 'next'
import { useRouter } from 'next/router'
import FeedComponent from 'shared/components/feed/Feed'

const Feed: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <h1>Feed</h1>
      <FeedComponent onItemPressed={(post) => router.push(`/feed/${post.id}`)} />
    </>
  )
}

export default Feed
