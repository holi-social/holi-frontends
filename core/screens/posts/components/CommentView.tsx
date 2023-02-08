import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { ContentType } from '@holi/core/queries'
import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { Comment } from '@holi/core/screens/posts/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { colors } from '@holi/ui/styles/globalVars'

export interface CommentProps extends ViewProps {
  comment: Comment
  created?: string
  style?: StyleProp<ViewStyle>
}

const CommentView: React.VFC<CommentProps> = ({ comment, style, ...props }) => {
  const { t } = useTranslation()

  const { creator } = comment
  const name = creator.fullName || t('user.profileView.anonymous')

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

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
          <View style={styles.bottomBar}>
            <HoliText size="small" style={styles.likesNumber}>
              0
            </HoliText>
            <HoliButton
              transparent
              inline
              label={t('global.like')}
              onPress={showFeatureNotImplementedToast}
              style={styles.likesButton}
            >
              <HoliIcon icon="heart" />
            </HoliButton>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundColorWhite,
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
  bottomBar: {
    marginTop: 21,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  likesNumber: {
    color: colors.foreground20,
  },
  likesButton: {
    marginLeft: 9,
  },
})

export default CommentView
