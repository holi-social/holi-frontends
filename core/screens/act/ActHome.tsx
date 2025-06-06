import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import { ActSection, ActSectionType } from '@holi/core/screens/act/ActSection'

import AttendingChallengeEventsLegacy from '@holi-apps/challenges/components/AttendingChallengeEventsLegacy'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { Stack } from 'holi-bricks/components/stack'
import { ActNavBar } from '@holi/core/screens/act/ActNavBar'
import { Screen } from '@holi/core/components/Screen'
import { Spacing } from 'holi-bricks/foundations'
import MarketingBanner from '@holi/core/screens/homeFeed/components/MarketingBanner'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

type ActHomeParams = {
  section: string
}

const { useParam } = createParamHooks<ActHomeParams>()

export const orderedSections = (includeTasks: boolean, selectedContentType?: string) => {
  const allSections = [
    ActSectionType.VOLUNTEERING,
    ActSectionType.EVENTS,
    ActSectionType.CHALLENGES,
    ActSectionType.TASKS,
    ActSectionType.DONATIONS,
  ]
  const sections = includeTasks ? allSections : allSections.filter((section) => section != ActSectionType.TASKS)

  if (selectedContentType) {
    const index = sections.findIndex((item) => item === selectedContentType)
    if (index > 0) {
      const [itemToMoveToTheFront] = sections.splice(index, 1)
      sections.unshift(itemToMoveToTheFront)
    }
  }
  return sections
}

const ActHome = () => {
  const { t } = useTranslation()
  const title = t('act.title')
  const [selectedContentType] = useParam('section')

  const includeTasks = !useFeatureFlagToggle(FeatureFlagKey.TYPESENSE_RECOS)
  const sections = orderedSections(includeTasks, selectedContentType)

  return (
    <Screen
      preset="scroll"
      contentContainerPadding={{ bottom: '3xl' }}
      scrollViewProps={{ contentContainerStyle: { paddingBottom: Spacing['3xl'] } }}
      headerOptions={{
        title,
        headerBackTitleVisible: true,
        headerBackVisible: true,
        headerTitle: '',
        headerLeft: ({ tintColor }) => (
          <HeaderTitle size="large" tintColor={tintColor}>
            {title}
          </HeaderTitle>
        ),
        headerRight: () => <NotificationAndSearchHeader />,
      }}
    >
      <Stack direction="column" gap="xs" testID="act-home">
        <ActNavBar />
        <Stack gap="xxl" direction="column">
          <HoliContainer>
            <MarketingBanner frameId="act-home-banner" />
          </HoliContainer>
          <AttendingChallengeEventsLegacy />
          {sections.map((sectionName) => (
            <ActSection type={sectionName} key={sectionName} />
          ))}
        </Stack>
      </Stack>
    </Screen>
  )
}

export default withProfiler(memo(ActHome), { name: 'ActHome' })
