import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import CommentConnector from '@holi/core/screens/comments/CommentConnector'
import { Comment } from '@holi/core/screens/comments/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { colors } from '@holi/ui/styles/globalVars'

export type CommentProps = {
  comment: Comment
  created?: string
  style?: StyleProp<ViewStyle>
}

const CommentView: React.VFC<CommentProps> = ({ comment, style }) => {
  const { t } = useTranslation()

  const { commenter } = comment
  const name = userFullName(commenter)
  return (
    <View style={[styles.wrapper, style]}>
      <HoliMediaHeader title={name} author={commenter} date={comment.created} boldTitle>
        <HoliButton transparent inline label={t('insights.post.preview.more')} style={styles.moreButton}>
          <HoliIcon icon="more" color={colors.fontColorGrey} />
        </HoliButton>
      </HoliMediaHeader>

      <View style={styles.body}>
        <CommentConnector style={styles.commentConnector} />
        <View style={styles.commentContent}>
          <HoliText style={styles.text}>{comment.text}</HoliText>
          <View style={styles.bottomBar}>
            <HoliText size="small" style={styles.likesNumber}>
              0
            </HoliText>
            <HoliIcon icon="heart" style={styles.likesIcon} />
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
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  body: {
    flexDirection: 'row',
    marginTop: 12,
  },
  text: {
    flex: 1,
    lineHeight: 20,
    marginLeft: 12,
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
    color: colors.fontColorGrey,
  },
  likesIcon: {
    marginLeft: 9,
  },
})

export default CommentView
