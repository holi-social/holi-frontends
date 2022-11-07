import React from 'react'
// import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface PostCommentButtonProps {
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const PostCommentButton: React.VFC<PostCommentButtonProps> = ({ onPress, style }) => {
  // const { t } = useTranslation()

  return (
    <HoliButton style={[styles.wrapper, style]} inline label="Leave a response..." transparent onPress={onPress}>
      <HoliText style={styles.text}>Leave a response...</HoliText>
    </HoliButton>
  )
}

export default PostCommentButton

const styles = StyleSheet.create({
  wrapper: {
    position: 'fixed',
    height: 100,
    bottom: 0,
    paddingTop: 17,
    paddingBottom: 50,
    paddingHorizontal: 24,
    borderTopColor: colors.borderColorGrey,
    borderTopWidth: 1,
  },
  text: {
    color: colors.fontColorGrey,
  },
})
