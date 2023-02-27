import { useMutation } from '@apollo/client'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliLink from '@holi//ui/components/molecules/HoliLink'
import { useAuth } from '@holi/core/auth/AuthContextProvider'
import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { ContentType } from '@holi/core/queries'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import { UpdatePostReactionMutation, UpdatePostReactionResponse } from '@holi/core/screens/posts/queries'
import { Post, ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

export type PostPreviewProps = {
  post: Post
  insightId?: string
  style?: StyleProp<ViewStyle>
}

const PostPreview: React.VFC<PostPreviewProps> = ({ post, insightId, style }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()
  const commenters = post.commenters.data
  const { visible, show, hide } = useModalState()

  const postUrl = insightId ? `/insights/${insightId}/posts/${post.id}` : `/posts/${post.id}`

  // currently only HEART-reactions are displayed
  const heartReactions = post.reactions.filter((reaction) => reaction.type === ReactionType.HEART)[0]
  const currentUserHasReacted = post.myReaction === ReactionType.HEART

  const [updatePostReaction] = useMutation<UpdatePostReactionResponse>(UpdatePostReactionMutation, {
    onCompleted: (response) => console.log('updateReaction done', response),
    onError: (error) => console.log('updateReaction error', error),
  })

  const reactOnPost = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginDialog()
    }
    updatePostReaction({
      variables: {
        id: post.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
    })
  }, [isLoggedIn, openLoginDialog, post.id, currentUserHasReacted, updatePostReaction])

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.paddingHorizontal}>
        <View style={styles.header}>
          <HoliLink
            href={`/profile/${post.creator.id}`}
            label={post.creator.fullName}
            testID="btn-to-post-creator-profile"
            style={styles.mediaHeaderLink}
          >
            <HoliMediaHeader title={post.creator.fullName} author={post.creator} date={post.created} />
          </HoliLink>

          <MoreOptionsButtonWithModal
            label={t('insights.post.preview.more')}
            showOptions={visible}
            onPress={show}
            onModalDismiss={hide}
            style={styles.moreButton}
          >
            <ReportBlockOptionButton
              action="report"
              objectId={post.id}
              contentType={ContentType.POST}
              style={styles.moreOptionItem}
              confirmationModalProps={{
                title: t('insights.post.report.confirmation.title'),
                description: t('insights.post.report.confirmation.description'),
              }}
              successMessage={t('global.report.successMessage')}
              onConfirm={hide}
            />
          </MoreOptionsButtonWithModal>
        </View>

        <HoliLink href={postUrl} label={post.title} textStyle={styles.postTitleLink} testID="btn-to-post">
          <HoliHeading size="small" style={styles.postTitle}>
            {post.title}
          </HoliHeading>
        </HoliLink>

        <HoliReadMore numberOfLines={10} fontStyle={styles.readMoreText}>
          <HoliRichTextOutput text={post.text} users={post.mentions} links={post.links} size="small" />
        </HoliReadMore>
      </View>

      {post.image && (
        <PostImage uri={post.image.url} height={post.image.height} width={post.image.width} postTitle={post.title} />
      )}

      {!!post.links?.length && (
        <View style={styles.paddingHorizontal}>
          <HoliLinkPreview style={styles.linkPreview} previewData={post.links[0]} label={post.links[0].title} />
        </View>
      )}

      {post.numberOfComments > 0 && (
        <View style={[styles.paddingHorizontal, styles.reactionsBar]}>
          <HoliLink
            href={`${postUrl}?commentId=first`}
            label={t('insights.posts.comments.link')}
            style={styles.reactionsLink}
          >
            <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
              {t('insights.post.response', { count: post.numberOfComments })}
            </HoliUserAvatarPile>
          </HoliLink>

          <HoliReactionsCount
            onPress={reactOnPost}
            type="post"
            count={heartReactions ? heartReactions.count : 0}
            active={currentUserHasReacted}
            fullName={post.creator.fullName}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background10,
  },
  paddingHorizontal: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
  },
  mediaHeaderLink: {
    flexShrink: 1,
    flexGrow: 1,
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  moreOptionItem: {
    justifyContent: 'center',
    paddingVertical: 18,
  },
  postTitleLink: {
    display: 'flex',
  },
  postTitle: {
    color: colors.foreground20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  readMoreText: {
    color: colors.foreground30,
    lineHeight: 20,
  },
  linkPreview: {
    marginTop: 16,
    maxWidth: 320,
  },
  reactionsBar: {
    marginTop: 21,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reactionsLink: {
    height: 'auto',
    display: 'flex',
  },
})

export default PostPreview
