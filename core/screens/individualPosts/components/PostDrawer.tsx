import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useReportContent from '@holi/core/hooks/useReportContent'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType } from '@holi/core/queries'
import { DeleteFeedPostResponse, deleteFeedPostMutation } from '@holi/core/screens/individualPosts/mutations'
import { feedPostsQuery, myPostsQuery } from '@holi/core/screens/individualPosts/queries'
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
  const auth = useAuth()
  const { navigate } = useRouting()
  const { track } = useTracking()

  const [isLoadingReport, reportContent] = useReportContent({
    id: post?.id || '',
    contentType: ContentType.FEED_POST,
    successMsg: t('global.report.successMessage'),
  })
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
      refetchQueries: [{ query: feedPostsQuery }, { query: myPostsQuery }],
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
    track(TrackingEvent.PostShare.Pressed(post.id))
    switch (await shareLink()) {
      case 'shared':
        track(TrackingEvent.PostShare.Shared(post.id))
        break
      case 'dismissed':
        track(TrackingEvent.PostShare.Dismissed(post.id))
        break
    }
  }

  return (
    <>
      <HoliActionDrawer.Drawer
        label={t('global.moreOptions')}
        testID="btn-post-more-options"
        buttonElement={children}
        onShow={() => track(TrackingEvent.PostActionDrawer.Opened(post.id))}
        onHide={() => track(TrackingEvent.PostActionDrawer.Closed(post.id))}
      >
        <HoliActionDrawer.Action
          icon={Share}
          title={t('global.share')}
          testID="btn-share-post"
          handleAction={onShare}
        />

        {auth.isLoggedIn && auth.userId === post.creator.id ? (
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
            isLoading={isLoadingReport}
            icon={Flag}
            title={t('global.report')}
            testID="btn-report-post"
            showConfirmation
          >
            <HoliActionDrawer.Confirmation
              title={t('insights.post.report.confirmation.title')}
              description={t('insights.post.report.confirmation.description')}
              handleConfirmation={reportContent}
              hasDismissBtn
              requireLogin
            />
          </HoliActionDrawer.Action>
        )}
      </HoliActionDrawer.Drawer>
      <HoliConfirmation
        show={showDeleteConfirmationModal}
        label={t('individuals.post.delete.dialog.title')}
        title={t('individuals.post.delete.dialog.title')}
        description={t('individuals.post.delete.dialog.message')}
        onDismiss={() => setShowDeleteConfirmationModal(false)}
        dismissText={t('individuals.post.delete.cancel.button')}
        confirmText={t('individuals.post.delete.confirmation.button')}
        testID="post-delete-dialog"
        onConfirm={handleDelete}
      />
    </>
  )
}

export default PostDrawer
