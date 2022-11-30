import { NextPage } from 'next'

import PostDetailPage from '@holi/core/screens/posts/PostDetailPage'

const PostPage: NextPage = () => <PostDetailPage />

PostPage.defaultProps = {
  hideFooter: true,
}

export default PostPage
