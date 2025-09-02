import { withProfiler } from '@sentry/react'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import { ActSection } from '@holi/core/screens/act/ActSection'

import { Stack } from 'holi-bricks/components/stack'
import { ActNavBar } from '@holi/core/screens/act/ActNavBar'
import { Screen } from '@holi/core/components/Screen'
import { Spacing } from 'holi-bricks/foundations'
import { orderedSections } from './sections'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { GoodDeedsChip } from '@holi/core/screens/homeFeed/components/GoodDeedsChip'
import { CounterModalContent } from '@holi/core/screens/homeFeed/components/GoodDeedsChipUser'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'

type ActHomeParams = {
  section: string
}

const { useParam } = createParamHooks<ActHomeParams>()

const ActHome = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const title = t('act.title')
  const [selectedContentType] = useParam('section')
  const [showGoodDeedChip] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_1)

  const sections = orderedSections(selectedContentType)

  // Modal state for welcome modal
  const { show: showWelcomeModal, hide: hideWelcomeModal, props: welcomeModalProps } = useModalState()

  // Show welcome modal when welcome=true query param is present
  useEffect(() => {
    if (router.query.welcome === 'true') {
      showWelcomeModal()
    }
  }, [router.query.welcome, showWelcomeModal])

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
