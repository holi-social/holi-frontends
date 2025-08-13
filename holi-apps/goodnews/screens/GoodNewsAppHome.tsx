import React, { memo, useState } from 'react'

import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'

import GoodNewsCarousel from '@holi-apps/goodnews/components/GoodNewsCarousel'
import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'
import { Screen } from '@holi/core/components/Screen'
import { white } from 'holi-bricks/foundations'

const GoodNewsAppHome = () => {
  const [activeDate, setActiveDate] = useState<string>()

  return (
    <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.GOODNEWS} i18nKey="goodnews.maintenance.feature">
      <Screen
        preset="fixed"
        headerOptions={{
          headerTitle: () => <GoodNewsHeader formattedDate={activeDate} />,
          headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} fallbackRoute="/" shadow="dark" />,
          headerTintColor: white,
          headerBackVisible: false,
          headerTitleAlign: 'center',
          headerTransparent: true,
          navigationCustomOptions: {
            footerShown: false,
          },
          statusBarStyle: 'light',
        }}
        testID="goodnews-app-home"
        backgroundColor="muted"
        contentContainerStyle={{ flex: 1 }}
      >
        <GoodNewsCarousel onActiveDateChange={setActiveDate} />
      </Screen>
    </PosthogFeatureFlagGuard>
  )
}

export default memo(GoodNewsAppHome)
