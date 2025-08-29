import React from 'react'

import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import MarketingCampaign from '@holi/core/screens/marketing/MarketingCampaign'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'

export type FeedStackScreens = {
  [RouteName.HomeFeed]: undefined
  [RouteName.MarketingCampaign]: undefined
}

const FeedStack = createNativeStackNavigator<FeedStackScreens>()

const FeedNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme
  const { t } = useTranslation()

  return (
    <FeedStack.Navigator
      initialRouteName={RouteName.HomeFeed}
      screenOptions={{ headerTintColor: colors.black300, headerShadowVisible: false }}
    >
      <FeedStack.Screen name={RouteName.HomeFeed} component={HomeFeed} />
      <FeedStack.Screen
        name={RouteName.MarketingCampaign}
        component={MarketingCampaign}
        options={{ title: t('homeFeed.marketingCampaign.title') }}
      />
    </FeedStack.Navigator>
  )
}

export default FeedNavigator
