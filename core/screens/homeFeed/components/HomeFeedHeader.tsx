import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HandWaveFilledPng from '@holi/ui/assets/img/icons/hand-wave-filled.png'
import HandWaveFilled from '@holi/ui/assets/img/icons/hand-wave-filled.svg'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const HomeFeedHeader: React.FC = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { user } = useLoggedInUser()

  return (
    <View style={mixins.container}>
      {/*Headline */}
      <HoliBox padding={[32, 0, 8, 0]} layout={styles.headlineContainer}>
        <HoliHeading level="1" size="xl" testID="home-feed-insights-heading">
          {user?.firstName ? t('homeFeed.heading.loggedIn', { firstname: user?.firstName }) : t('homeFeed.heading')}
        </HoliHeading>
        <HoliLocalImage
          imageSource={Platform.OS === 'android' ? HandWaveFilledPng : HandWaveFilled}
          width={40}
          height={40}
          label={''}
          style={styles.handwaveFilled}
          isSvg={Platform.OS !== 'android'}
        />
      </HoliBox>
    </View>
  )
}

export default withProfiler(HomeFeedHeader, { name: 'HomeFeedHeader' })

const styles = StyleSheet.create({
  headlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  handwaveFilled: {
    paddingLeft: 8,
  },
})
