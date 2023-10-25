import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import GoodNewsUpdates from '@holi-apps/goodnews/components/GoodNewsUpdates'
import VolunteeringUpdates from '@holi-apps/volunteering/components/VolunteeringUpdates'

const UpdatesOfYourApps = () => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  return (
    <HoliBox padding={[32, 0, 0, 0]}>
      <View style={[mixins.container, styles.wrapper]}>
        <HoliHeading size="large">{t('apps.updates.headline')}</HoliHeading>
        <FeatureToggleGuard
          toggleName={FeatureToggleName.APPS_DONATIONS}
          featureNameKey="donations:maintenance.feature"
          noLayout
        >
          <DonationUpdates style={styles.updatesContainer} />
        </FeatureToggleGuard>
        <FeatureToggleGuard
          toggleName={FeatureToggleName.APPS_GOODNEWS}
          featureNameKey="goodnews:maintenance.feature"
          noLayout
        >
          <GoodNewsUpdates style={styles.updatesContainer} />
        </FeatureToggleGuard>
        <FeatureToggleGuard
          toggleName={FeatureToggleName.APPS_VOLUNTEERING}
          featureNameKey="volunteering:maintenance.feature"
          noLayout
        >
          <VolunteeringUpdates style={styles.updatesContainer} />
        </FeatureToggleGuard>
      </View>
    </HoliBox>
  )
}

export default UpdatesOfYourApps

const styles = StyleSheet.create({
  wrapper: {
    gap: 24,
  },
  updatesContainer: {
    // dummy ...
    minHeight: 200,
    paddingBottom: 12,
  },
  maintenance: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
})
