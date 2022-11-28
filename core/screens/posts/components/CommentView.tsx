import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import VerticalLine from '@holi/core/screens/posts/components/VerticalLine'
import { Comment } from '@holi/core/screens/posts/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { REGEX_USER_MENTIONS } from '@holi/ui/helper/richText'
import { colors } from '@holi/ui/styles/globalVars'

export type CommentProps = {
  comment: Comment
  created?: string
  style?: StyleProp<ViewStyle>
}

const CommentView: React.VFC<CommentProps> = ({ comment, style }) => {
  const { t } = useTranslation()

  const { creator, mentions } = comment
  const name = creator.fullName || t('user.profileView.anonymous')

  const getNameById = (id: string) => mentions?.find((mention) => mention.id === id)?.fullName || ''

  /**
   * Replaces each @<USER-ID>
   * with the highlighted fullName
   */
  const textWithMentions = (() => {
    const textParts: React.ReactChild[] = []
    comment.text.split(REGEX_USER_MENTIONS).forEach((textPart, index) => {
      const isMatch = textPart.match(REGEX_USER_MENTIONS)
      const replaced = isMatch ? textPart.replace(REGEX_USER_MENTIONS, getNameById(textPart.slice(1))) : undefined
      if (replaced) {
        textParts.push(
          <HoliText key={index} style={{ color: colors.fontColorHighlighted }}>
            @{replaced}
          </HoliText>
        )
      } else {
        textParts.push(<HoliText key={index}>{textPart}</HoliText>)
      }
    })
    return textParts
  })()

  return (
    <View style={[styles.wrapper, style]}>
      <HoliMediaHeader title={name} author={creator} date={comment.created} boldTitle>
        <HoliButton transparent inline label={t('insights.post.preview.more')} style={styles.moreButton}>
          <HoliIcon icon="more" color={colors.fontColorGrey} />
        </HoliButton>
      </HoliMediaHeader>

      <View style={styles.body}>
        <VerticalLine style={styles.commentConnector} />
        <View style={styles.commentContent}>
          <HoliText style={styles.text}>{textWithMentions}</HoliText>
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
