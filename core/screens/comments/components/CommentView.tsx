import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliMediaAuthorHeader from '@holi/core/components/HoliMediaAuthorHeader'
import { getFormattedDate } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { ContentType, ContentType3K } from '@holi/core/queries'
import CommentText from '@holi/core/screens/comments/components/CommentText'
import VerticalLine from '@holi/core/screens/comments/components/VerticalLine'
import useDeleteComment from '@holi/core/screens/comments/hooks/useDeleteComment'
import useReactOnComment from '@holi/core/screens/comments/hooks/useReactOnComment'
import { Comment, CommentableType, ReactionType } from '@holi/core/screens/comments/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Comments as CommentsIcon, Delete, Flag } from '@holi/icons/src/generated'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar, { AvatarSize } from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import Comments from './Comments'

export interface CommentProps extends ViewProps {
  comment: Comment
  commentableId: string
  commentableType: CommentableType
  created?: string
  onPressComment?: () => void
  avatarSize?: AvatarSize
  startWithOpenThread?: boolean
  style?: StyleProp<ViewStyle>
}

const CommentView = ({
  comment,
  commentableId,
  commentableType,
  onPressComment,
  avatarSize = 'small',
  startWithOpenThread,
  style,
  ...props
}: CommentProps) => {
  const [isRepliesOpen, setIsRepliesOpen] = useState(false)
  const { user: loggedInUser, isLoggedIn } = useLoggedInUser()
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigate } = useRouting()

  const { openSignupModal } = useSignupModal()
  const isInsight = commentableType === CommentableType.DISCUSSION

  useEffect(() => {
    if (startWithOpenThread) {
      setIsRepliesOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isLoadingDeleteComment, deleteComment] = useDeleteComment(comment.id, commentableId, commentableType)

  const [addReaction, removeReaction, loadingAddReaction, loadingRemoveReaction] = useReactOnComment(
    comment.id,
    ReactionType.HEART
  )

  const heartReactions = comment.reactions.HEART
  const currentUserHasReacted = !!comment.myReaction.HEART

  const reactOnComment = () => {
    if (!isLoggedIn) {
      return openSignupModal({
        description: t('comments.react.loginRedirect.text'),
        trackTrigger: isInsight ? 'REACT_COMMENT_ON_INSIGHT' : 'REACT_COMMENT_ON_POST',
      })
    }

    if (loadingAddReaction || loadingRemoveReaction) return

    if (!currentUserHasReacted) {
      addReaction()
    } else {
      removeReaction()
    }
  }

  const isCurrentUserCommentCreator = comment.creator.id === loggedInUser?.id

  const { creator } = comment
  const name = creator.fullName || t('user.profileView.anonymous')

  const formattedDate = getFormattedDate(comment.created, i18n.language)

  return (
    <View style={[styles.wrapper, style]} {...props} testID={'comment-item'}>
      <View style={styles.header}>
        <View style={styles.mediaHeaderLink}>
          <HoliLink href={`/profile/${creator.id}`} label={name} testID="btn-to-commenter-profile">
            <HoliMediaAuthorHeader
              author={creator}
              date={avatarSize !== 'micro' ? comment.created : undefined} // don't show the date when it's a reply (show it above the text instead)
              avatarSize={avatarSize}
              role={creator.role}
            />
          </HoliLink>
        </View>

        <HoliColumn>
          <SafeAreaProvider>
            <HoliActionDrawer.Drawer label={t('global.options')} testID="comment-three-dot-menu-button">
              {/* reporting own content makes no sense, so we hide this option */}
              {!isCurrentUserCommentCreator && (
                <HoliActionDrawer.Action
                  icon={Flag}
                  title={t('global.report')}
                  testID="report-comment-button"
                  handleAction={() =>
                    navigate(`/report/${comment.id}/${ContentType.POST_COMMENT}/${ContentType3K.COMMENT}`)
                  }
                />
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
        <VerticalLine style={avatarSize === 'micro' ? styles.commentConnectorMicro : styles.commentConnector} />
        <View style={styles.commentContent}>
          <View style={styles.text}>
            {avatarSize === 'micro' && (
              <HoliText size="small" color="gray300" style={{ marginBottom: 12 }}>
                {formattedDate}
              </HoliText>
            )}
            <CommentText comment={comment} />
          </View>

          <View style={[styles.reactionsBar, !onPressComment && styles.reactionsBarWithoutComment]}>
            {!!onPressComment && (
              <HoliButton
                transparent
                inline
                label={t('comments.create_comment_button')}
                contentStyle={styles.addComment}
                onPress={() => {
                  if (loggedInUser) onPressComment()
                  else
                    openSignupModal({
                      description: t(
                        isInsight
                          ? 'insight.discussion.comment.loginRedirect.text'
                          : 'comments.react.loginRedirect.text'
                      ),
                      trackTrigger: isInsight ? 'REPLY_COMMENT_ON_INSIGHT' : 'REPLY_COMMENT_ON_POST',
                    })
                }}
              >
                {!!loggedInUser && (
                  <HoliAvatar
                    imageSrc={loggedInUser.avatar}
                    imageBlurhash={loggedInUser.avatarBlurhash}
                    label={loggedInUser.fullName ?? ''}
                    initials={loggedInUser.avatarLabel || ''}
                    defaultColor={loggedInUser.avatarDefaultColor || ''}
                    size="micro"
                  />
                )}
                <HoliText disabled size="small" color="gray300">
                  {t('comments.create_comment_button')}
                </HoliText>
              </HoliButton>
            )}

            <HoliReactionsCount
              onPress={reactOnComment}
              type="comment"
              count={heartReactions}
              active={currentUserHasReacted}
              fullName={comment.creator.fullName}
              testID="btn-react-to-comment-HEART"
            />
          </View>
          {comment.totalReplies > 0 && !isRepliesOpen && (
            <HoliButton
              transparent
              label={t('comments.response', { count: comment.totalReplies })}
              contentStyle={styles.commentsBar}
              onPress={() => setIsRepliesOpen(true)}
            >
              <HoliIcon icon={CommentsIcon} />
              <HoliText disabled size="small" color="gray300">
                {t('comments.response', { count: comment.totalReplies })}
              </HoliText>
            </HoliButton>
          )}
          {comment.totalReplies > 0 && isRepliesOpen && (
            <View style={styles.replies}>
              <Comments commentableType={commentableType} commentableId={commentableId} parentCommentId={comment.id} />
            </View>
          )}
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
      marginTop: Spacing.xxs,
    },
    text: {
      flex: 1,
      marginLeft: Spacing.xs,
    },
    commentConnector: {
      marginHorizontal: Spacing.sm,
    },
    commentConnectorMicro: {
      marginHorizontal: Spacing.xxs,
    },
    commentContent: {
      flex: 1,
      paddingBottom: Spacing.xs,
    },
    reactionsBar: {
      marginTop: Spacing.xxs,
      marginLeft: Spacing.xs,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    commentsBar: {
      marginTop: Spacing['3xs'],
      marginLeft: Spacing.xs,
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    replies: {
      marginTop: Spacing['3xs'],
      marginLeft: Spacing.xs,
    },
    reactionsBarWithoutComment: {
      justifyContent: 'flex-end',
    },
    addComment: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginBottom: Spacing['3xs'],
    },
  })

export default CommentView
