import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType, ContentType3K } from '@holi/core/queries'
import { DeleteFeedPostResponse, deleteFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import { allPostsQuery, myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Delete, Edit2, Flag, Share } from '@holi/icons/src/generated'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'

type PostDrawerProps = {
  post: FeedPost
  children: React.ReactNode
  onDelete?: () => void
  style?: StyleProp<ViewStyle>
}

const PostDrawer: React.FC<PostDrawerProps> = ({ post, children, onDelete }: PostDrawerProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const loginState = useLoggedInUser()
  const { navigate } = useRouting()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const { track } = useTracking()

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)

  const [deleteFeedPost] = useMutation<DeleteFeedPostResponse>(deleteFeedPostMutation, {
    onCompleted: onDelete,
    onError: (error) =>
      displayError(error, 'Failed to delete feed post', {
        location: 'PostDrawer.deleteFeedPost',
      }),
    refetchQueries: [{ query: myPostsQuery }, 'MyPosts'],
  })

  const handleDelete = () => {
    setShowDeleteConfirmationModal(false)
    deleteFeedPost({
      variables: { postId: post.id },
      refetchQueries: [{ query: allPostsQuery }, { query: myPostsQuery }],
    }).then(() => {
      openToast(t('individuals.post.delete.success'), HoliToastType.SUCCESS)
    })
  }

  const deleteFeedPostActionHandler = () => {
    setShowDeleteConfirmationModal(true)
  }

  const editFeedPostActionHandler = () => {
    navigate(`/feed-posts/${post.id}/edit`)
  }

  const [, shareLink] = useShareLink({
    link: `/feed-posts/${post.slug}`,
    linkType: LinkType.UNIVERSAL,
    message: post.title,
  })

  const onShare = async () => {
    if ((await shareLink()) === 'shared') {
      track(TrackingEvent.FeedPosts.shared(post.id, post.title))
    }
  }

  return (
    <>
      <HoliActionDrawer.Drawer label={t('global.moreOptions')} testID="btn-post-more-options" buttonElement={children}>
        <HoliActionDrawer.Action
          icon={Share}
          title={t('global.share')}
          testID="btn-share-post"
          handleAction={onShare}
        />

        {loginState.isLoggedIn && loginState.user.id === post.author.id ? (
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
            handleAction={() =>
              navigateWithAuth(`/report/${post.id}/${ContentType.FEED_POST}/${ContentType3K.FEED_POST}`)
            }
          />
        )}
      </HoliActionDrawer.Drawer>
      <HoliConfirmation
        show={showDeleteConfirmationModal}
        label={t('individuals.post.delete.dialog.title')}
        title={t('individuals.post.delete.dialog.title')}
        description={t('individuals.post.delete.dialog.message')}
        onDismiss={() => setShowDeleteConfirmationModal(false)}
        secondaryText={t('individuals.post.delete.cancel.button')}
        primaryText={t('individuals.post.delete.confirmation.button')}
        testID="post-delete-dialog"
        onPrimary={handleDelete}
      />
    </>
  )
}

export default PostDrawer
