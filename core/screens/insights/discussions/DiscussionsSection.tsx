import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const DiscussionsSection = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.section}>
      <View style={styles.title}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/conversation.svg')}
          label=""
          width={40}
          height={36}
          isSvg
        />
        <HoliHeading>{t('insights.discussions.title')}</HoliHeading>
      </View>
      <View style={styles.children}>{children}</View>
    </View>
  )
}

const getStyles = ({ colors }: HoliTheme) =>
  StyleSheet.create({
    section: {
      alignSelf: 'center',
      width: '100%',
      paddingHorizontal: Spacing.xs,
      paddingVertical: Spacing.md,
      maxWidth: dimensions.maxScreenWidth,
      backgroundColor: colors.brandA200,
      borderColor: colors.black300,
      borderWidth: 1,
      borderRadius: 24,
      marginBottom: Spacing.xl,
      padding: 0,
    },
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['3xs'],
      marginBottom: Spacing.md,
    },
    children: {
      flexDirection: 'column',
      gap: Spacing.xs,
    },
  })

export default DiscussionsSection
