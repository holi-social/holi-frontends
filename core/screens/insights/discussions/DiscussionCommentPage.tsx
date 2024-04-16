import { useQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CommentForm from '@holi/core/screens/comments/components/CommentForm'
import { CommentableType } from '@holi/core/screens/comments/types'
import DiscussionHeader from '@holi/core/screens/insights/discussions/DiscussionHeader'
import { DiscussionResponse, discussionById } from '@holi/core/screens/insights/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { useTheme } from '@holi/ui/styles/theme'

export type DiscussionCommentPageParams = {
  discussionId: string
}

const { useParam } = createParamHooks<DiscussionCommentPageParams>()

const DiscussionCommentPage = () => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const setScreenOptions = useSetScreenOptions()
  const [discussionId] = useParam('discussionId')
  const { replaceRoute } = useRouting()

  const { theme } = useTheme()
  const { colors } = theme

  const { data: { discussionById: discussion } = {} } = useQuery<DiscussionResponse>(discussionById, {
    variables: { discussionId },
    notifyOnNetworkStatusChange: true,
    skip: !discussionId,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      logError(error, 'Failed to load discussion', {
        location: 'DiscussionCommentPage.discussionById',
        variables: { discussionId },
      })
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

  return (
    discussion &&
    user && (
      <CommentForm commentableId={discussion.id} commentableType={CommentableType.DISCUSSION} user={user}>
        <DiscussionHeader question={discussion.question} />
      </CommentForm>
    )
  )
}

export default DiscussionCommentPage
