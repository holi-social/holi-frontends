import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, Platform, StyleProp, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface PostDetailsFooterProps {
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const PostDetailsFooter: React.FC<PostDetailsFooterProps> = ({ onPress, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  return (
    <HoliButton
      inline
      transparent
      style={[styles.button, style]}
      label={t('comments.create_comment_button')}
      onPress={onPress}
      testID="feed-post-details-footer"
    >
      <HoliText style={styles.text}>{t('individuals.post.card.comment')}</HoliText>
    </HoliButton>
  )
}

export default PostDetailsFooter

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    button: {
      paddingHorizontal: 24,
      backgroundColor: theme.colors.background10,
      ...Platform.select({
        web: {
          width: '100%',
        },
      }),
    },
    text: {
      paddingTop: 9,
      color: theme.colors.foreground20,
    },
  })
