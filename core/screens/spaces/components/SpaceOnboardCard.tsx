import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type OnboardingCard = {
  image: StaticImageData
  description: string
  instruction: string
}

type OnboardCardProps = {
  content: OnboardingCard
}

const SpaceOnboardCard = ({ content }: OnboardCardProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.onboardCardContainer}>
      <HoliLocalImage
        imageSource={content.image}
        width={279}
        height={200}
        label={''}
        isSvg={true}
        resizeMode="contain"
        style={styles.illustration}
      />
      <HoliText style={styles.onboardingDescription}>{t(content.description)}</HoliText>
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
