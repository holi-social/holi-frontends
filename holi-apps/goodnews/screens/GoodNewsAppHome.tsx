import React, { memo, useState } from 'react'

import { Screen } from '@holi/core/components/Screen'
import { useStyles } from 'holi-bricks/styles'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'

import GoodNewsCarousel from '@holi-apps/goodnews/components/GoodNewsCarousel'
import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'

const GoodNewsAppHome = () => {
  const [activeDate, setActiveDate] = useState<string>()

  const { theme } = useStyles()

  return (
    <Screen
      headerOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTitle: () => <GoodNewsHeader formattedDate={activeDate} />,
        headerLeft: () => <HeaderBackButton tintColor={theme.colors.fill.white} fallbackRoute="/" />,
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerTransparent: true,
        navigationCustomOptions: {
          background: { type: 'gradient' },
          footerShown: false,
        },
      }}
      statusBarProps={{ translucent: true, animated: true, style: 'light' }}
    >
      <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.GOODNEWS} i18nKey="goodnews.maintenance.feature">
        <GoodNewsCarousel onActiveDateChange={setActiveDate} />
      </PosthogFeatureFlagGuard>
    </Screen>
  )
}

export default memo(GoodNewsAppHome)
