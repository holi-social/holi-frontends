import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { isForbiddenError, isNotFoundError, logError } from '@holi/core/errors/helpers'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CommentForm from '@holi/core/screens/comments/components/CommentForm'
import { CommentableType } from '@holi/core/screens/comments/types'
import PostContent from '@holi/core/screens/individualPosts/components/PostContent'
import { PostQueryResponse, postQuery } from '@holi/core/screens/individualPosts/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { useTheme } from '@holi/ui/styles/theme'

export type PostCommentPageParams = {
  slug: string
}

const PostCommentPage = () => {
  const { useParam } = createParamHooks<PostCommentPageParams>()

  const [slug] = useParam('slug')
  const { navigate, replaceRoute } = useRouting()
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const setScreenOptions = useSetScreenOptions()

  const { theme } = useTheme()
  const { colors } = theme

  const {
    loading,
    error,
    data: { post } = {},
  } = useQuery<PostQueryResponse>(postQuery, {
    variables: { idOrSlug: slug },
    skip: !slug,
    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load feed post', { location: 'PostCommentPage.postQuery', slug })
    },
  })

  useLayoutEffect(
    () =>
      setScreenOptions({
        title: t('comments.title'),
        headerStyle: { backgroundColor: colors.background10 },
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setScreenOptions, t, colors.background10]
  )

  if (loading || error || !post) {
    return <></>
  }

  if (!user) {
    navigate(`/feedPosts/${slug}`)
    return null
  }

  return (
    <CommentForm commentableId={post.id} commentableType={CommentableType.FEED_POST} user={user}>
      <PostContent post={post} />
    </CommentForm>
  )
}

export default withProfiler(memo(PostCommentPage), { name: 'CommentInputPage' })
