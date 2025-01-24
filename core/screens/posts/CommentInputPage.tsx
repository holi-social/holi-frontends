import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { isForbiddenError, isNotFoundError, logError } from '@holi/core/errors/helpers'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CommentForm from '@holi/core/screens/comments/components/CommentForm'
import { CommentableType } from '@holi/core/screens/comments/types'
import PostContent from '@holi/core/screens/posts/components/PostContent'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import { PostById, type PostByIdResponse } from '@holi/core/screens/posts/queries'
import { useTheme } from '@holi/ui/styles/theme'

export type CommentInputPageParams = {
  insightId?: string
  spaceIdOrName?: string
  postId: string
}

const CommentInputPage = () => {
  const { useParam, useUUIDParam } = createParamHooks<CommentInputPageParams>()

  const [insightId] = useUUIDParam('insightId')
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [postId] = useUUIDParam('postId')
  const { navigate, replaceRoute } = useRouting()
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const setScreenOptions = useSetScreenOptions()

  const { theme } = useTheme()
  const { colors } = theme

  const { loading, error, data } = useQuery<PostByIdResponse>(PostById, {
    variables: { id: postId },
    skip: !postId,
    onError: (error) => {
      if (isNotFoundError(error) || isForbiddenError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load post', { location: 'CommentInputPage.PostById', postId })
    },
  })

  useLayoutEffect(
    () =>
      setScreenOptions({
        title: t('comments.title'),
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setScreenOptions, t, colors.background10]
  )

  const post = data?.postById

  if (loading || error || !post) {
    return <></>
  }

  if (!user) {
    navigate(getPostUrl(postId, insightId, spaceIdOrName))
    return null
  }

  return (
    <CommentForm commentableId={post.id} commentableType={CommentableType.POST} user={user}>
      <PostContent post={post} />
    </CommentForm>
  )
}

export default withProfiler(memo(CommentInputPage), { name: 'CommentInputPage' })
