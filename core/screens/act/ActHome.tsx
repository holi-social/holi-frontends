import { withProfiler } from '@sentry/react'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import { ActSection } from '@holi/core/screens/act/ActSection'

import { Stack } from 'holi-bricks/components/stack'
import { ActNavBar } from '@holi/core/screens/act/ActNavBar'
import { Screen } from '@holi/core/components/Screen'
import { Spacing } from 'holi-bricks/foundations'
import MarketingBanner from '@holi/core/screens/homeFeed/components/MarketingBanner'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import * as Appcues from '@appcues/react-native'
import { orderedSections } from './sections'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { GoodDeedsChip } from '@holi/core/screens/homeFeed/components/GoodDeedsChip'
import { CounterModalContent } from '@holi/core/screens/homeFeed/components/GoodDeedsChipUser'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import {
  storeWelcomeGoodDeedsCounterModal,
  useWelcomeGoodDeedsCounterModal,
} from '@holi/core/screens/act/useDisplayWelcomeGoodDeedsCounterModal/useDisplayWelcomeGoodDeedsCounterModal'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import { BadgesDocument } from '@holi/api/graphql/graphql-codegen'
import { useApolloClient } from '@apollo/client'
import { useEarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesModalProvider'

type ActHomeParams = {
  section: string
}

const { useParam } = createParamHooks<ActHomeParams>()

const ActHome = () => {
  Appcues.screen('Good Deeds')
  const { t } = useTranslation()
  const title = t('act.title')
  const [selectedContentType] = useParam('section')
  const [showGoodDeedChip] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_1)
  const welcomeGoodDeedsCounterModal = useWelcomeGoodDeedsCounterModal()
  const showAppcuesBanner = useFeatureFlagToggle(FeatureFlagKey.APPCUES_BANNER)
  const client = useApolloClient()
  const checkNewBadges = useEarnedBadgesModal()
  const [badgesEnabled] = useFeatureFlag(FeatureFlagKey.BADGES)
  const sections = orderedSections(selectedContentType)

  const { show: showWelcomeModal, hide: hideWelcomeModal, props: welcomeModalProps } = useModalState()

  useEffect(() => {
    if (welcomeGoodDeedsCounterModal) {
      showWelcomeModal()
      storeWelcomeGoodDeedsCounterModal(false)
    }
  }, [welcomeGoodDeedsCounterModal, showWelcomeModal])

  useEffect(() => {
    if (!badgesEnabled) return
    ;(async () => {
      await client.refetchQueries({ include: [BadgesDocument] })

      if (badgesEnabled) {
        await checkNewBadges()
      }
    })()
  }, [client, badgesEnabled, checkNewBadges])

  return (
    <>
      <Screen
        preset="scroll"
        scrollViewProps={{ contentContainerStyle: { paddingBottom: Spacing['3xl'] } }}
        headerOptions={{
          title,
          headerBackTitleVisible: true,
          headerBackVisible: true,
          headerTitle: '',
          headerLeft: ({ tintColor }) => (
            <Stack direction="row" gap="xxs" alignItems="center">
              <HeaderTitle size="large" tintColor={tintColor}>
                {title}
              </HeaderTitle>
              {showGoodDeedChip && <GoodDeedsChip />}
            </Stack>
          ),
          headerRight: () => <NotificationAndSearchHeader />,
        }}
      >
        <Stack direction="column" gap="xs" testID="act-home">
          <ActNavBar />
          <Stack direction="column">
            {showAppcuesBanner && (
              <HoliContainer>
                <MarketingBanner frameId="act-home-banner" />
              </HoliContainer>
            )}
            <Stack gap="xxl">
              {sections.map((sectionName) => (
                <ActSection type={sectionName} key={sectionName} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Screen>

      {/* Welcome Modal */}
      <HoliModal
        {...welcomeModalProps}
        label={t('personalGoodDeedCounter.drawer.default.banner.title', 'Welcome to Good Deeds')}
        autoHeight
      >
        <HoliModalContentWrapper actionButtonText={t('modal.close', 'Close')} onActionButtonPress={hideWelcomeModal}>
          <CounterModalContent count={1} />
        </HoliModalContentWrapper>
      </HoliModal>
    </>
  )
}

export default withProfiler(memo(ActHome), { name: 'ActHome' })
