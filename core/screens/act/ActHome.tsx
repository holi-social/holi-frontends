import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
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

type ActHomeParams = {
  section: string
}

const { useParam } = createParamHooks<ActHomeParams>()

const ActHome = () => {
  Appcues.screen('Good Deeds')
  const { t } = useTranslation()
  const title = t('act.title')
  const [selectedContentType] = useParam('section')

  const sections = orderedSections(selectedContentType)

  return (
    <Screen
      preset="scroll"
      scrollViewProps={{ contentContainerStyle: { paddingBottom: Spacing['3xl'] } }}
      headerOptions={{
        title,
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
        <Stack direction="column">
          <HoliContainer>
            <MarketingBanner frameId="act-home-banner" />
          </HoliContainer>
          <Stack gap="xxl">
            {sections.map((sectionName) => (
              <ActSection type={sectionName} key={sectionName} />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Screen>
  )
}

export default withProfiler(memo(ActHome), { name: 'ActHome' })
