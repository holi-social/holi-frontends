import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, Platform, StyleSheet, View } from 'react-native'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const COMMENT_BUTTON_CONTAINER_HEIGHT = 74

interface PostDetailFooterProps {
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const PostDetailFooter: React.FC<PostDetailFooterProps> = ({ onPress }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  return (
    <SafeArea edges={['bottom']}>
      <View style={styles.wrapper}>
        <HoliContainer flex={1}>
          <HoliButton
            inline
            transparent
            style={styles.button}
            label={t('comments.create_comment_button')}
            onPress={onPress}
            testID="post-detail-footer"
          >
            <HoliText style={styles.text}>{t('comments.create_comment_button')}</HoliText>
          </HoliButton>
        </HoliContainer>
      </View>
    </SafeArea>
  )
}

export default PostDetailFooter

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background10,
      borderTopColor: theme.colors.background30,
      borderTopWidth: 1,
      width: '100%',
      height: COMMENT_BUTTON_CONTAINER_HEIGHT,
      ...Platform.select({
        web: {
          position: 'fixed',
          bottom: 0,
        },
      }),
    },
    button: {
      flex: 1,
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
