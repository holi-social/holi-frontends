import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import ActionDrawer from '@holi/core/components/ActionDrawer'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { ContentType } from '@holi/core/queries'
import CommentDeleteButton from '@holi/core/screens/posts/components/CommentDeleteButton'
import CommentReactions from '@holi/core/screens/posts/components/CommentReactions'
import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { Comment } from '@holi/core/screens/posts/types'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'

export interface CommentProps extends ViewProps {
  comment: Comment
  postId: string
  created?: string
  style?: StyleProp<ViewStyle>
}

const CommentView: React.VFC<CommentProps> = ({ comment, postId, style, ...props }) => {
  const { t } = useTranslation()

  const { creator } = comment
  const name = creator.fullName || t('user.profileView.anonymous')

  const { visible, show, hide } = useModalState()

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
            <ActionDrawer.Drawer
              label={t('insights.post.preview.more')}
              showOptions={visible}
              onPress={show}
              onModalDismiss={hide}
              style={styles.moreButton}
              testID="comment-three-dot-menu-button"
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
                testID="report-comment-button"
              />
              <CommentDeleteButton
                comment={comment}
                postId={postId}
                onConfirm={hide}
                style={styles.moreOptionItem}
                testID="delete-comment-button"
              />
            </ActionDrawer.Drawer>
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
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  moreOptionItem: {
    justifyContent: 'center',
    paddingVertical: 12,
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
