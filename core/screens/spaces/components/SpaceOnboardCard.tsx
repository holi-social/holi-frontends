import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { breakpoints } from 'holi-bricks/foundations'

type OnboardingCard = {
  image: StaticImageData
  description: string
  instruction?: string
}

type OnboardCardProps = {
  content: OnboardingCard
  imgWidth: number
  imgHeight: number
}

const SpaceOnboardCard = ({ content, imgWidth, imgHeight }: OnboardCardProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const screenWidth = Dimensions.get('window').width
  const adjustedImgWidth = screenWidth < breakpoints.xs ? imgWidth * 0.6 : imgWidth
  const adjustedImgHeight = screenWidth <= breakpoints.xs ? imgHeight * 0.6 : imgHeight

  return (
    <View style={styles.onboardCardContainer}>
      <HoliLocalImage
        imageSource={content.image}
        width={adjustedImgWidth}
        height={adjustedImgHeight}
        label={content.description}
        resizeMode="contain"
        style={styles.illustration}
      />
      <HoliText style={styles.onboardingDescription}>
        <Trans t={t} i18nKey={content.description}>
          <HoliText bold />
        </Trans>
      </HoliText>
      {content.instruction && (
        <HoliText bold style={styles.onboardingInstruction}>
          {t(content.instruction)}
        </HoliText>
      )}
    </View>
  )
}

export default SpaceOnboardCard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    illustration: {
      marginBottom: 8,
    },
    onboardCardContainer: {
      padding: 24,
      borderWidth: 1,
      borderRadius: 16,
      borderColor: theme.colors.foreground30,
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: theme.colors.background20,
      height: '100%',
      flex: 1,
      ...(Platform.OS !== 'web' && { paddingBottom: 8 }),
    },
    onboardingDescription: {
      marginTop: 24,
      textAlign: 'center',
    },
    onboardingInstruction: {
      marginTop: 12,
    },
  })
