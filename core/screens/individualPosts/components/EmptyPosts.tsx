import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'

const EmptyPosts = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigate } = useRouting()

  return (
    <View style={styles.container}>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_feed_post.svg')}
        isSvg
        label={''}
        width={231}
        height={164}
      />
      <View style={styles.message}>
        <HoliText size="small" align="center">
          {t('individuals.post.emptyTitle')}
        </HoliText>
        <HoliText size="large" align="center">
          {t('individuals.post.emptyPrompt')}
        </HoliText>
      </View>
      <Button inline label={t('individuals.post.input.first')} onPress={() => navigate('/feed-posts/create')} />
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.xs,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.xl,
      paddingHorizontal: Spacing.md,
      borderColor: theme.colors.gray200,
      borderWidth: 1,
      gap: Spacing.md,
      alignItems: 'center',
    },
    message: {
      gap: Spacing['3xs'],
    },
  })

export default EmptyPosts
