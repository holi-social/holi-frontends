import React from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { Dimensions, StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

type OnboardingCard = {
  image: StaticImageData
  description: string
  instruction: string
}

type OnboardCardProps = {
  content: OnboardingCard
  imgWidth: number
  imgHeight: number
}

const SpaceOnboardCard = ({ content, imgWidth, imgHeight }: OnboardCardProps) => {
  const { t } = useTranslation()

  const screenWidth = Dimensions.get('window').width

  const adjustedImgWidth = screenWidth < dimensions.breakpointXs ? imgWidth * 0.6 : imgWidth

  const adjustedImgHeight = screenWidth <= dimensions.breakpointXs ? imgHeight * 0.6 : imgHeight

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
      <HoliText bold style={styles.onboardingInstruction}>
        {t(content.instruction)}
      </HoliText>
    </View>
  )
}

export default SpaceOnboardCard

const styles = StyleSheet.create({
  illustration: {
    marginBottom: 8,
  },
  onboardCardContainer: {
    padding: 24,
    paddingBottom: 8,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.foreground30,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: colors.background20,
    height: '100%',
    flex: 1,
  },
  onboardingDescription: {
    marginTop: 24,
    textAlign: 'center',
  },
  onboardingInstruction: {
    marginTop: 12,
  },
})
