import { withProfiler } from '@sentry/react'
import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import AnnouncementBanner from '@holi/core/screens/homeFeed/components/AnnouncementBanner'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import AttendingChallengeEvents from '@holi-apps/challenges/components/AttendingChallengeEvents'
import { Stack } from 'holi-bricks/components/stack'

const HomeFeedHeader = () => {
  const { t } = useTranslation()

  const bannerShowCutoff = new Date(2024, 3, 12, 0, 0, 0)

  return (
    <Stack gap="sm" margin={{ bottom: '3xs', top: 'md' }} testID="home-feed-insights-heading">
      {new Date() < bannerShowCutoff && (
        <>
          <HoliGap size="s" />
          <AnnouncementBanner>
            <Text size="md">
              <Trans t={t} i18nKey="homeFeed.banner.privacyPolicyUpdated">
                <HoliTextLink
                  label={t('profile.settings.legalDocuments.privacyPolicy')}
                  href="/profile/settings/legalDocuments/document?type=privacyPolicy"
                  size="md"
                >
                  {t('profile.settings.legalDocuments.privacyPolicy')}
                </HoliTextLink>
              </Trans>
            </Text>
          </AnnouncementBanner>
        </>
      )}

      <AttendingChallengeEvents />
    </Stack>
  )
}

export default withProfiler(HomeFeedHeader, { name: 'HomeFeedHeader' })
