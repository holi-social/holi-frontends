import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useDeleteComment from '@holi/core/hooks/useDeleteComment'
import useReportContent from '@holi/core/hooks/useReportContent'
import { ContentType } from '@holi/core/queries'
import CommentReactions from '@holi/core/screens/posts/components/CommentReactions'
import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { Comment } from '@holi/core/screens/posts/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { Delete, Flag } from '@holi/icons/src/generated'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'

export interface CommentProps extends ViewProps {
  comment: Comment
  postId: string
  created?: string
  style?: StyleProp<ViewStyle>
}

const CommentView = ({ comment, postId, style, ...props }: CommentProps) => {
  const { user: loggedInUser } = useLoggedInUser()
  const { t } = useTranslation()
  const [isLoadingReport, reportContent] = useReportContent({
    id: comment.id,
    contentType: ContentType.POST_COMMENT,
    successMsg: t('global.report.successMessage'),
  })
  const isCurrentUserCommentCreator = comment.creator.id === loggedInUser?.id
  const [isLoadingDeleteComment, deleteComment] = useDeleteComment(comment.id, postId)

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
            <HoliActionDrawer.Drawer label={t('insights.post.preview.more')} testID="comment-three-dot-menu-button">
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
                    title={t('insights.posts.comment.report.confirmation.title')}
                    description={t('insights.posts.comment.report.confirmation.description')}
                    testID="space-report"
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
                  title={t('insights.posts.comment.delete.title')}
                  variant="danger"
                  testID="delete-comment-button"
                  showConfirmation
                >
                  <HoliActionDrawer.Confirmation
                    title={t('insights.posts.comment.delete.title')}
                    description={t('insights.posts.comment.delete.confirmation.description')}
                    dismissText={t('insights.posts.comment.delete.confirmation.dismiss')}
                    confirmText={t('insights.posts.comment.delete.confirmation.confirm')}
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
          <HoliRichTextOutput text={comment.text} users={comment.mentions} style={styles.text} />

          <View style={styles.reactionsBar}>
            <CommentReactions comment={comment} />
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
