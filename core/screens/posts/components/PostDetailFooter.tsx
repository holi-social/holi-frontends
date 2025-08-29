import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, Platform, StyleProp, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface PostDetailFooterProps {
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const PostDetailFooter: React.FC<PostDetailFooterProps> = ({ onPress, style }) => {
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
      testID="post-detail-footer"
    >
      <HoliText style={styles.text}>{t('comments.create_comment_button')}</HoliText>
    </HoliButton>
  )
}

export default PostDetailFooter

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.colors.background10,
      justifyContent: 'center',
      ...Platform.select({
        web: {
          width: '100%',
        },
      }),
    },
    text: {
      color: theme.colors.foreground20,
    },
  })
