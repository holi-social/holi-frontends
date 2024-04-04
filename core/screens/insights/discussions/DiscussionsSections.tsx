import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

const DiscussionSection = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()

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
      <HoliGap size="m" />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
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
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
})

export default DiscussionSection
