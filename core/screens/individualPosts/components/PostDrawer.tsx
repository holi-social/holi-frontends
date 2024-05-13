import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { DeleteFeedPostResponse, deleteFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import { feedPostsQuery, myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import { Delete, Edit2, Flag, Share } from '@holi/icons/src/generated'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'

type PostDrawerProps = {
  post: FeedPost
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

const PostDrawer: React.FC<PostDrawerProps> = ({ post, children }: PostDrawerProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const { userId, isLoggedIn } = useAuth()
  const { navigate } = useRouting()

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const [deleteFeedPost] = useMutation<DeleteFeedPostResponse>(deleteFeedPostMutation, {
    onError: (error) =>
      displayError(error, 'Failed to delete feed post', {
        location: 'PostDrawer.deleteFeedPost',
      }),
    refetchQueries: [{ query: myPostsQuery }, 'MyPosts'],
  })

  const onDelete = () => {
    setShowConfirmationModal(false)
    deleteFeedPost({
      variables: { postId: post.id },
      refetchQueries: [{ query: feedPostsQuery }, { query: myPostsQuery }],
    })
    openToast(t('individuals.post.delete.success'), HoliToastType.SUCCESS)
  }

  const deleteFeedPostActionHandler = () => {
    setShowConfirmationModal(true)
  }

  const editFeedPostActionHandler = () => {
    navigate(`/feed-posts/${post.id}/edit`)
  }

  const reportFeedPostActionHandler = () => {
    return
  }

  const [, shareLink] = useShareLink({
    link: `/feed-posts/${post.slug}`,
    linkType: LinkType.UNIVERSAL,
    message: post.title,
  })

  return (
    isLoggedIn && (
      <>
        <HoliActionDrawer.Drawer
          label={t('global.moreOptions')}
          testID="btn-post-more-options"
          buttonElement={children}
        >
          <HoliActionDrawer.Action
            icon={Share}
            title={t('global.share')}
            testID="btn-share-post"
            handleAction={shareLink}
          />

          {post.creator.id === userId ? (
            <>
              <HoliActionDrawer.Action
                icon={Edit2}
                title={t('global.edit')}
                testID="btn-edit-post"
                handleAction={editFeedPostActionHandler}
              />
              <HoliActionDrawer.Action
                icon={Delete}
                title={t('global.delete')}
                testID="btn-delete-post"
                handleAction={deleteFeedPostActionHandler}
                variant="danger"
              />
            </>
          ) : (
            <HoliActionDrawer.Action
              icon={Flag}
              title={t('global.report')}
              testID="btn-report-post"
              handleAction={reportFeedPostActionHandler}
            />
          )}
        </HoliActionDrawer.Drawer>
        <HoliConfirmation
          show={showConfirmationModal}
          label={t('individuals.post.delete.dialog.title')}
          title={t('individuals.post.delete.dialog.title')}
          description={t('individuals.post.delete.dialog.message')}
          onDismiss={() => setShowConfirmationModal(false)}
          dismissText={t('individuals.post.delete.cancel.button')}
          confirmText={t('individuals.post.delete.confirmation.button')}
          testID="post-delete-dialog"
          onConfirm={onDelete}
        />
      </>
    )
  )
}

export default PostDrawer
