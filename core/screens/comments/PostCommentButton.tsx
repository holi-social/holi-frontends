import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface PostCommentButtonProps {
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const PostCommentButton: React.VFC<PostCommentButtonProps> = ({ onPress, style }) => {
  const { t } = useTranslation()

  return (
    <HoliButton
      inline
      transparent
      style={[styles.wrapper, style]}
      label={t('insights.posts.comments.create_comment_button')}
      onPress={onPress}
    >
      <HoliText style={styles.text}>{t('insights.posts.comments.create_comment_button')}</HoliText>
    </HoliButton>
  )
}

export default PostCommentButton

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 18,
    paddingBottom: 50,
    paddingHorizontal: 24,
    borderTopColor: colors.borderColorGrey,
    backgroundColor: colors.backgroundColor,
    borderTopWidth: 1,
    ...Platform.select({
      web: {
        paddingBottom: 100,
        width: '100%',
      },
    }),
  },
  text: {
    color: colors.fontColorGrey,
  },
})
