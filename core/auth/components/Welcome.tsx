import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

interface Props {
  handleSkip: () => void
}

const Welcome = ({ handleSkip }: Props) => {
  const { t } = useTranslation()
  const handlePress = () => {
    handleSkip()
  }

  return (
    <View style={styles.screen}>
      <HoliBox padding={[0, 0, 32, 0]}>
        <HoliCarousel
          marginHorizontal={20}
          slides={[
            {
              children: (
                <View style={styles.carouselItem}>
                  <HoliLottie loop={false} animType="onboardingOneEN" />
                </View>
              ),
            },
            {
              children: <HoliText>Hello</HoliText>,
            },
          ]}
        />
      </HoliBox>
      <Pressable accessible accessibilityRole={'button'} onPress={handlePress}>
        <HoliText size="extrasmall" color="gray300">
          {t('registration.accountSetup.welcome')}
        </HoliText>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'papayawhip',
    paddingTop: 64,
    paddingBottom: 40,
  },
  carouselItem: {
    width: '100%',
    paddingHorizontal: 24,
  },
})

export default Welcome
