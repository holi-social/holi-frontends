import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import InsightsFAQ from '@holi/core/screens/homeFeed/insightsFAQ'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Information } from '@holi/icons/src/generated'
import HandWaveFilledPng from '@holi/ui/assets/img/icons/hand-wave-filled.png'
import HandWaveFilled from '@holi/ui/assets/img/icons/hand-wave-filled.svg'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const HomeFeedHeader: React.FC = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const {
    show: showInsightsFAQ,
    hide: hideInsightsFAQ,
    props: insightFAQModalProps,
  } = useModalState({ visible: false })
  const { user } = useLoggedInUser()

  return (
    <View style={mixins.container}>
      {/*Headline */}
      <HoliBox padding={[32, 0, 8, 0]}>
        <HoliHeading level="1" size="large" testID="home-feed-insights-heading" style={{ display: 'flex' }}>
          {user?.firstName ? t('homeFeed.heading.loggedIn', { firstname: user?.firstName }) : t('homeFeed.heading')}
          {Platform.OS === 'android' ? (
            <HoliLocalImage
              imageSource={HandWaveFilledPng}
              width={28}
              height={28}
              label={''}
              style={styles.handwaveFilled}
            />
          ) : (
            <HoliLocalImage
              imageSource={HandWaveFilled}
              width={28}
              height={28}
              label={''}
              style={styles.handwaveFilled}
              isSvg
            />
          )}
        </HoliHeading>
      </HoliBox>
      {/* Insight FAQ with Popup */}
      <HoliButton
        label={t('homeFeed.insights.subtitle')}
        transparent
        style={styles.insightsSubtitleContent}
        onPress={showInsightsFAQ}
        testID="home-feed-insights-subtitle-button"
        inline
      >
        <HoliBox padding={[8, 0]}>
          <View style={styles.insightsSubtitleContent}>
            <HoliHeading
              level="3"
              size="small"
              testID="home-feed-insights-subtitle"
              style={styles.insightsSubtitleText}
            >
              {t('homeFeed.insights.subtitle')}
            </HoliHeading>
            <HoliIcon icon={Information} size={20} filled={false} color={colors.foreground20} />
          </View>
        </HoliBox>
      </HoliButton>

      <HoliModal
        label={t('homeFeed.insights.subtitle')}
        {...insightFAQModalProps}
        autoHeight={false}
        relativeHeight={0.8}
        testID="insights-faq-modal"
      >
        <InsightsFAQ onDismiss={hideInsightsFAQ} />
      </HoliModal>
    </View>
  )
}

export default withProfiler(HomeFeedHeader, { name: 'HomeFeedHeader' })

const styles = StyleSheet.create({
  handwaveFilled: {
    paddingLeft: 8,
  },
  insightsSubtitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightsSubtitleText: {
    fontWeight: '400',
    color: colors.foreground20,
  },
})
