import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { fullName } from '@holi/core/helpers'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { colors } from '@holi/ui/styles/globalVars'

import CommentConnector from './CommentConnector'
import { Comment } from './types'

export type CommentProps = {
  comment: Comment
  created?: string
  style?: StyleProp<ViewStyle>
}

const CommentView: React.VFC<CommentProps> = ({ comment, style }) => {
  const { t } = useTranslation()

  const { creator } = comment
  const name = fullName(creator.firstName, creator.lastName)
  return (
    <View style={[styles.wrapper, style]}>
      <HoliMediaHeader title={name} author={creator} date={comment.created} boldTitle style={styles.header}>
        <HoliButton transparent inline label={t('insights.post.preview.options')} style={styles.optionsButton}>
          <HoliIcon icon="options" size={12} color={colors.fontColorGrey} />
        </HoliButton>
      </HoliMediaHeader>

      <View style={styles.body}>
        <CommentConnector />
        <HoliText style={styles.text}>{comment.text}</HoliText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundColorWhite,
  },
  optionsButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  header: { marginBottom: 12 },
  body: {
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    lineHeight: 20,
    marginLeft: 12,
    marginBottom: 44,
  },
})

export default CommentView
