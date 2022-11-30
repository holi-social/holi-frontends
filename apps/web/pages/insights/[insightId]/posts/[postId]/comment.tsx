import { NextPage } from 'next'

import CommentInputPage from '@holi/core/screens/posts/CommentInputPage'

const PostPage: NextPage = () => <CommentInputPage />

PostPage.defaultProps = {
  hideFooter: true,
}

export default PostPage
