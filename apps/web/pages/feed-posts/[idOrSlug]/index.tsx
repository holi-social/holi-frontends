import type { GetServerSidePropsContext } from 'next'

import PostDetailsPage from '@holi/core/screens/individualPosts/PostDetailsPage'
import { postQuery } from '@holi/core/screens/individualPosts/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { idOrSlug } = context.query

  const queries = [
    {
      query: postQuery,
      variables: {
        idOrSlug,
      },
      skip: !idOrSlug,
    },
  ]

  return createServerSideProps(context, queries)
}

export default PostDetailsPage
