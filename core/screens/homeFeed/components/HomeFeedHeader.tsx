import { withProfiler } from '@sentry/react'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import AnnouncementBanner from '@holi/core/screens/homeFeed/components/AnnouncementBanner'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HandWaveFilledPng from '@holi/ui/assets/img/icons/hand-wave-filled.png'
import HandWaveFilled from '@holi/ui/assets/img/icons/hand-wave-filled.svg'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'

const HomeFeedHeader: React.FC = () => {
  const { t } = useTranslation()

  const { user } = useLoggedInUser()

  const bannerShowCutoff = new Date(2024, 3, 12, 0, 0, 0)

  return (
    <HoliContainer>
      {new Date() < bannerShowCutoff && (
        <>
          <HoliGap size="s" />
          <AnnouncementBanner>
            <HoliText>
              <Trans t={t} i18nKey="homeFeed.banner.privacyPolicyUpdated">
                <HoliTextLink
                  label={t('profile.settings.legalDocuments.privacyPolicy')}
                  href="/profile/settings/legalDocuments/document?type=privacyPolicy"
                >
                  <HoliText style={{ textDecorationLine: 'underline' }}>Datenschutzhinweise</HoliText>
                </HoliTextLink>
              </Trans>
            </HoliText>
          </AnnouncementBanner>
        </>
      )}

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
    </HoliContainer>
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
