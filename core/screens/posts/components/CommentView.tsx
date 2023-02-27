import { useMutation } from '@apollo/client'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { ContentType } from '@holi/core/queries'
import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { UpdatePostCommentReactionMutation, UpdatePostCommentReactionResponse } from '@holi/core/screens/posts/queries'
import { Comment, ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'

export interface CommentProps extends ViewProps {
  comment: Comment
  created?: string
  style?: StyleProp<ViewStyle>
}

const CommentView: React.VFC<CommentProps> = ({ comment, style, ...props }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()

  const { creator } = comment
  const name = creator.fullName || t('user.profileView.anonymous')

  // currently only HEART-reactions are displayed
  const heartReactions = comment.reactions.filter((reaction) => reaction.type === ReactionType.HEART)[0]
  const currentUserHasReacted = comment.myReaction === ReactionType.HEART

  const [updatePostCommentReaction] = useMutation<UpdatePostCommentReactionResponse>(
    UpdatePostCommentReactionMutation,
    {
      onCompleted: (response) => console.log('updateCommentReaction done', response),
      onError: (error) => console.log('updateCommentReaction error', error),
    }
  )

  const reactOnComment = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginDialog()
    }
    updatePostCommentReaction({
      variables: {
        id: comment.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
    })
  }, [isLoggedIn, openLoginDialog, comment.id, currentUserHasReacted, updatePostCommentReaction])

  const { visible, show, hide } = useModalState()

  return (
    <View style={[styles.wrapper, style]} {...props}>
      <View style={styles.header}>
        <HoliLink
          href={`/profile/${creator.id}`}
          label={name}
          testID="btn-to-commenter-profile"
          style={styles.mediaHeaderLink}
        >
          <HoliMediaHeader title={name} author={creator} date={comment.created} />
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
            objectId={comment.id}
            contentType={ContentType.POST_COMMENT}
            style={styles.moreOptionItem}
            confirmationModalProps={{
              title: t('insights.posts.comment.report.confirmation.title'),
              description: t('insights.posts.comment.report.confirmation.description'),
            }}
            successMessage={t('global.report.successMessage')}
            onConfirm={hide}
          />
        </MoreOptionsButtonWithModal>
      </View>

      <View style={styles.body}>
        <VerticalLine style={styles.commentConnector} />
        <View style={styles.commentContent}>
          <HoliRichTextOutput text={comment.text} users={comment.mentions} style={styles.text} />

          <View style={styles.reactionsBar}>
            <HoliReactionsCount
              onPress={reactOnComment}
              type="comment"
              count={heartReactions ? heartReactions.count : 0}
              active={currentUserHasReacted}
              fullName={name}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background10,
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
  body: {
    flexDirection: 'row',
    marginTop: 12,
  },
  text: {
    flex: 1,
    lineHeight: 20,
    marginLeft: 15,
  },
  commentConnector: {
    marginHorizontal: 20,
  },
  commentContent: {
    flex: 1,
  },
  reactionsBar: {
    marginTop: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})

export default CommentView
