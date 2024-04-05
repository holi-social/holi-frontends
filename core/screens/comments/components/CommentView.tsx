import { DocumentNode, useMutation } from '@apollo/client'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useErrorHandling } from '@holi/core/errors/hooks'
import useDeleteComment from '@holi/core/hooks/useDeleteComment'
import useReportContent from '@holi/core/hooks/useReportContent'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import { ContentType } from '@holi/core/queries'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import { Comment, CommentableType, ReactionAction, ReactionType } from '@holi/core/screens/comments/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { Delete, Flag } from '@holi/icons/src/generated'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface CommentProps extends ViewProps {
  updateReactionMutation: DocumentNode
  comment: Comment
  commentableId: string
  reportContentType: ContentType
  commentableType: CommentableType
  created?: string
  style?: StyleProp<ViewStyle>
}

const CommentView = ({
  updateReactionMutation,
  comment,
  commentableId,
  reportContentType,
  commentableType,
  style,
  ...props
}: CommentProps) => {
  const { user: loggedInUser } = useLoggedInUser()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const { displayError } = useErrorHandling()

  const heartReactions = comment.reactions.HEART
  const currentUserHasReacted = !!comment.myReaction.HEART

  const [updateReaction] = useMutation(updateReactionMutation, {
    onError: (error) =>
      displayError(error, 'Failed to update comment reaction', {
        location: 'CommentReactions.updateReaction',
        commentId: comment.id,
      }),
  })

  const reactOnComment = () => {
    if (!isLoggedIn) {
      return openLoginModal({
        description: t('comments.react.loginRedirect.text'),
      })
    }
    updateReaction({
      variables: {
        id: comment.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
    })
  }

  const [isLoadingReport, reportContent] = useReportContent({
    id: comment.id,
    contentType: reportContentType,
    successMsg: t('global.report.successMessage'),
  })
  const isCurrentUserCommentCreator = comment.creator.id === loggedInUser?.id
  const [isLoadingDeleteComment, deleteComment] = useDeleteComment(comment.id, commentableId, commentableType)

  const { creator } = comment
  const name = creator.fullName || t('user.profileView.anonymous')

  return (
    <View style={[styles.wrapper, style]} {...props} testID={'comment-item'}>
      <View style={styles.header}>
        <View style={styles.mediaHeaderLink}>
          <HoliLink href={`/profile/${creator.id}`} label={name} testID="btn-to-commenter-profile">
            <HoliMediaHeader title={name} author={creator} date={comment.created} />
          </HoliLink>
        </View>

        <HoliColumn>
          <SafeAreaProvider>
            <HoliActionDrawer.Drawer label={t('global.options')} testID="comment-three-dot-menu-button">
              {/* reporting own content makes no sense, so we hide this option */}
              {!isCurrentUserCommentCreator && (
                <HoliActionDrawer.Action
                  isLoading={isLoadingReport}
                  icon={Flag}
                  title={t('global.report')}
                  testID="report-comment-button"
                  showConfirmation
                >
                  <HoliActionDrawer.Confirmation
                    title={t('comment.report.confirmation.title')}
                    description={t('comment.report.confirmation.description')}
                    testID="comment-report"
                    handleConfirmation={reportContent}
                    hasDismissBtn
                    requireLogin
                  />
                </HoliActionDrawer.Action>
              )}
              {/* deleting only allowed for own content */}
              {isCurrentUserCommentCreator && (
                <HoliActionDrawer.Action
                  isLoading={isLoadingDeleteComment}
                  icon={Delete}
                  title={t('comment.delete.title')}
                  variant="danger"
                  testID="delete-comment-button"
                  showConfirmation
                >
                  <HoliActionDrawer.Confirmation
                    title={t('comment.delete.title')}
                    description={t('comment.delete.confirmation.description')}
                    dismissText={t('comment.delete.confirmation.dismiss')}
                    confirmText={t('comment.delete.confirmation.confirm')}
                    testID="delete-comment"
                    handleConfirmation={deleteComment}
                    buttonType="warning"
                    hasDismissBtn
                    requireLogin
                  />
                </HoliActionDrawer.Action>
              )}
            </HoliActionDrawer.Drawer>
          </SafeAreaProvider>
        </HoliColumn>
      </View>

      <View style={styles.body}>
        <VerticalLine style={styles.commentConnector} />
        <View style={styles.commentContent}>
          <HoliRichTextOutput text={comment.text} users={comment.mentions || []} style={styles.text} allowAllLinks />

          <View style={styles.reactionsBar}>
            <HoliReactionsCount
              onPress={reactOnComment}
              type="comment"
              count={heartReactions}
              active={currentUserHasReacted}
              fullName={comment.creator.fullName}
              testID="btn-react-to-comment-HEART"
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background10,
    },
    header: {
      flexDirection: 'row',
    },
    mediaHeaderLink: {
      flexShrink: 1,
      flexGrow: 1,
    },
    body: {
      flexDirection: 'row',
      marginTop: 12,
    },
    text: {
      flex: 1,
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
